/**
 * Upload Manager - Gerenciador de Upload com Compressão de Imagens
 * Arquivo: gerenciador.upload.js
 * Versão corrigida para problemas com câmera e galeria
 */

class ImageCompressor {
    constructor(options = {}) {
        this.maxWidth = options.maxWidth || 1920;
        this.quality = options.quality || 0.7;
        this.maxFileSizeMB = options.maxFileSizeMB || 50;
        this.allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/jpg'];
    }

    async compressImage(file) {
        return new Promise((resolve, reject) => {
            if (!file.type.match('image.*')) {
                reject(new Error('Não é uma imagem válida'));
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Redimensionar se necessário
                    if (width > this.maxWidth) {
                        height = (height * this.maxWidth) / width;
                        width = this.maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Converter para blob com qualidade
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error('Falha ao comprimir imagem'));
                                return;
                            }

                            // Criar novo arquivo comprimido
                            const compressedFile = new File([blob], this.generateFileName(file.name), {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });

                            console.log(`Compressão: ${this.formatBytes(file.size)} → ${this.formatBytes(blob.size)}`);
                            resolve(compressedFile);
                        },
                        'image/jpeg',
                        this.quality
                    );
                };

                img.onerror = () => reject(new Error('Erro ao carregar imagem'));
            };

            reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
        });
    }

    generateFileName(originalName) {
        const timestamp = new Date().getTime();
        const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
        return `${nameWithoutExt}_${timestamp}.jpg`;
    }

    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    isImageFile(file) {
        return file.type.startsWith('image/') && this.allowedTypes.includes(file.type.toLowerCase());
    }
}

class UploadManager {
    constructor() {
        this.compressor = new ImageCompressor({
            maxWidth: 1920,
            quality: 0.7,
            maxFileSizeMB: 50
        });
        this.uploading = false;
        this.files = [];
        this.initiated = false;
        this.currentFileInput = null;
    }

    init() {
        if (this.initiated) return;

        console.log('Inicializando Upload Manager...');
        this.bindEvents();
        this.initiated = true;
        console.log('Upload Manager inicializado');
    }

    bindEvents() {
        console.log('Configurando eventos...');

        // Configurar botões direto por ID
        const btnCamera = document.getElementById('btnCamera');
        const btnGaleria = document.getElementById('btnGaleria');
        const submitButton = document.getElementById('btnEnviarDocumentos');
        const dropArea = document.getElementById('dropArea');
        const fileInput = document.getElementById('arquivos_upload');
        const cameraInput = document.getElementById('camera_input');

        if (btnCamera) {
            console.log('Configurando botão câmera...');
            btnCamera.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Câmera clicada');
                this.openCamera();
            });
        } else {
            console.error('Botão câmera não encontrado');
        }

        if (btnGaleria) {
            console.log('Configurando botão galeria...');
            btnGaleria.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Galeria clicada');
                this.openGallery();
            });
        } else {
            console.error('Botão galeria não encontrado');
        }

        if (submitButton) {
            console.log('Configurando botão enviar...');
            submitButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Enviar clicado');
                this.startUpload();
            });
        }

        if (dropArea) {
            console.log('Configurando área de drop...');
            // Remover eventos de drag and drop se não quiser
            dropArea.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Área de drop clicada');
                this.openGallery();
            });
        }

        if (fileInput) {
            console.log('Configurando input galeria...');
            fileInput.addEventListener('change', (e) => {
                console.log('Arquivos selecionados da galeria:', e.target.files);
                this.handleFileSelect(e.target.files);
                // Limpar o input para poder selecionar os mesmos arquivos novamente
                e.target.value = '';
            });
        }

        if (cameraInput) {
            console.log('Configurando input câmera...');
            cameraInput.addEventListener('change', (e) => {
                console.log('Foto tirada da câmera:', e.target.files);
                this.handleCameraCapture(e.target.files);
                // Limpar o input para poder tirar outra foto
                e.target.value = '';
            });
        }

        console.log('Eventos configurados com sucesso');
    }

    openCamera() {
        console.log('Abrindo câmera...');
        const cameraInput = document.getElementById('camera_input');

        if (!cameraInput) {
            console.error('Input de câmera não encontrado');
            this.showNotification('Erro: input de câmera não encontrado', 'danger');
            return;
        }

        try {
            // Para mobile, usar capture="camera" funciona melhor
            cameraInput.setAttribute('accept', 'image/*');
            cameraInput.setAttribute('capture', 'camera');
            cameraInput.removeAttribute('multiple');

            // Disparar clique no input
            console.log('Disparando clique no input da câmera...');
            cameraInput.click();
        } catch (error) {
            console.error('Erro ao abrir câmera:', error);
            this.showNotification('Erro ao abrir câmera: ' + error.message, 'danger');
        }
    }

    openGallery() {
        console.log('Abrindo galeria...');
        const fileInput = document.getElementById('arquivos_upload');

        if (!fileInput) {
            console.error('Input de arquivo não encontrado');
            this.showNotification('Erro: input de galeria não encontrado', 'danger');
            return;
        }

        try {
            // Configurar para aceitar múltiplas imagens
            fileInput.setAttribute('accept', 'image/*');
            fileInput.setAttribute('multiple', 'multiple');
            fileInput.removeAttribute('capture');

            // Disparar clique no input
            console.log('Disparando clique no input da galeria...');
            fileInput.click();
        } catch (error) {
            console.error('Erro ao abrir galeria:', error);
            this.showNotification('Erro ao abrir galeria: ' + error.message, 'danger');
        }
    }

    handleFileSelect(files) {
        if (!files || files.length === 0) {
            console.log('Nenhum arquivo selecionado');
            return;
        }

        console.log(`Processando ${files.length} arquivo(s) da galeria...`);
        const fileArray = Array.from(files);
        this.processFiles(fileArray);
    }

    handleCameraCapture(files) {
        if (!files || files.length === 0) {
            console.log('Nenhuma foto tirada');
            return;
        }

        console.log(`Processando foto da câmera...`);
        this.processFiles([files[0]]);
    }

    async processFiles(files) {
        const maxFiles = 20;
        const maxSizeMB = this.compressor.maxFileSizeMB;
        const maxSizeBytes = maxSizeMB * 1024 * 1024;

        console.log(`Verificando ${files.length} arquivo(s)...`);

        if (this.files.length + files.length > maxFiles) {
            this.showNotification(`Máximo de ${maxFiles} arquivos permitidos!`, 'warning');
            return;
        }

        let filesAdded = 0;

        for (const file of files) {
            // Verificar se é imagem
            if (!this.compressor.isImageFile(file)) {
                this.showNotification(`Tipo de arquivo não permitido: ${file.name}. Apenas JPG e PNG são aceitos.`, 'warning');
                continue;
            }

            // Verificar tamanho
            if (file.size > maxSizeBytes) {
                this.showNotification(`Arquivo ${file.name} excede ${maxSizeMB}MB!`, 'warning');
                continue;
            }

            try {
                // Adicionar à lista
                this.files.push(file);
                this.createPreview(file, this.files.length - 1);
                filesAdded++;

                console.log(`Arquivo adicionado: ${file.name} (${this.compressor.formatBytes(file.size)})`);
            } catch (error) {
                console.error(`Erro ao processar arquivo ${file.name}:`, error);
                this.showNotification(`Erro ao processar ${file.name}`, 'danger');
            }
        }

        if (filesAdded > 0) {
            this.showNotification(`${filesAdded} arquivo(s) adicionado(s) com sucesso!`, 'success', 2000);
            this.updateUI();
        }
    }

    createPreview(file, index) {
        const previewContainer = document.getElementById('arquivosPreview');
        if (!previewContainer) {
            console.error('Container de preview não encontrado');
            return;
        }

        const col = document.createElement('div');
        col.className = 'col-6 col-md-4 mb-3';
        col.id = `preview-${index}`;

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target.result;
                col.innerHTML = `
                    <div class="card h-100">
                        <div class="position-relative">
                            <img src="${imageUrl}" class="card-img-top" style="height: 150px; object-fit: cover; width: 100%;">
                            <button type="button" class="btn btn-sm btn-danger btn-remove-file" 
                                    data-index="${index}"
                                    style="position: absolute; top: 5px; right: 5px; z-index: 10;">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="card-body p-2">
                            <div class="d-flex justify-content-between align-items-center">
                                <div style="overflow: hidden;">
                                    <small class="text-muted d-block text-truncate" style="max-width: 120px;" 
                                           title="${file.name}">
                                        ${file.name}
                                    </small>
                                    <small class="text-muted">${this.compressor.formatBytes(file.size)}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                // Configurar botão de remoção
                const removeBtn = col.querySelector('.btn-remove-file');
                removeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.removeFile(index);
                });

                previewContainer.appendChild(col);
            };
            reader.readAsDataURL(file);
        }
    }

    removeFile(index) {
        if (index < 0 || index >= this.files.length) {
            console.error('Índice de arquivo inválido:', index);
            return;
        }

        const removedFile = this.files[index];
        this.files.splice(index, 1);

        // Remover preview
        const preview = document.getElementById(`preview-${index}`);
        if (preview) {
            preview.remove();
        }

        // Atualizar índices dos previews restantes
        this.updatePreviewsIndices();

        this.updateUI();

        console.log(`Arquivo removido: ${removedFile.name}`);
        this.showNotification('Arquivo removido', 'info', 2000);
    }

    updatePreviewsIndices() {
        const previews = document.querySelectorAll('[id^="preview-"]');
        previews.forEach((preview, newIndex) => {
            // Atualizar ID
            preview.id = `preview-${newIndex}`;

            // Atualizar índice no botão
            const btn = preview.querySelector('.btn-remove-file');
            if (btn) {
                btn.setAttribute('data-index', newIndex);
            }
        });
    }

    async startUpload() {
        if (this.uploading) {
            this.showNotification('Upload já em andamento!', 'warning');
            return;
        }

        if (this.files.length === 0) {
            this.showNotification('Nenhum arquivo selecionado para upload!', 'warning');
            return;
        }

        const submitButton = document.getElementById('btnEnviarDocumentos');
        if (!submitButton) {
            console.error('Botão de envio não encontrado');
            return;
        }

        const originalText = submitButton.innerHTML;

        this.uploading = true;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Comprimindo...';

        try {
            // 1. Comprimir todas as imagens
            this.showNotification(`Comprimindo ${this.files.length} imagem(ns)...`, 'info');
            const compressedFiles = [];

            for (let i = 0; i < this.files.length; i++) {
                const file = this.files[i];
                try {
                    const compressedFile = await this.compressor.compressImage(file);
                    compressedFiles.push(compressedFile);

                    // Atualizar progresso
                    const progress = Math.round(((i + 1) / this.files.length) * 100);
                    submitButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Comprimindo ${progress}%`;
                } catch (error) {
                    console.error(`Erro ao comprimir ${file.name}:`, error);
                    // Se falhar na compressão, usa o original
                    compressedFiles.push(file);
                }
            }

            // 2. Preparar FormData
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
            const formData = this.prepareFormData(compressedFiles);

            // 3. Enviar para servidor
            const result = await this.sendToServer(formData);

            // 4. Sucesso
            this.showNotification(result.message || 'Upload concluído com sucesso!', 'success');

            // Fechar modal após 1 segundo
            setTimeout(() => {
                $('#modalDocumentosDigitais').modal('hide');
            }, 1000);

            this.clear();

        } catch (error) {
            console.error('Erro no upload:', error);
            this.showNotification(error.message || 'Erro ao processar arquivos', 'danger');
        } finally {
            this.uploading = false;
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    }

    prepareFormData(files) {
        const form = document.getElementById('form_documentos_digitais');
        if (!form) {
            throw new Error('Formulário não encontrado');
        }

        const formData = new FormData();

        // Adicionar token CSRF
        const token = document.querySelector('meta[name="csrf-token"]');
        if (token) {
            formData.append('_token', token.getAttribute('content'));
        }

        // Adicionar nr_pedido
        const nrPedido = form.querySelector('[name="nr_pedido"]');
        if (nrPedido) {
            formData.append('nr_pedido', nrPedido.value);
        }

        // Adicionar arquivos comprimidos
        files.forEach((file, index) => {
            formData.append('arquivos[]', file);
        });

        return formData;
    }

    async sendToServer(formData) {
        const form = document.getElementById('form_documentos_digitais');
        if (!form) {
            throw new Error('Formulário não encontrado');
        }

        const url = form.getAttribute('action');

        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                dataType: 'json',
                success: (response) => {
                    console.log('Resposta do servidor:', response);
                    if (response.success) {
                        resolve(response);
                    } else {
                        reject(new Error(response.message || 'Erro no servidor'));
                    }
                },
                error: (xhr, status, error) => {
                    console.error('Erro AJAX:', xhr.status, error);

                    let errorMsg = 'Erro ao enviar arquivos!';

                    if (xhr.responseJSON) {
                        if (xhr.responseJSON.message) {
                            errorMsg = xhr.responseJSON.message;
                        } else if (xhr.responseJSON.errors) {
                            const errors = xhr.responseJSON.errors;
                            errorMsg = Object.values(errors).flat().join(', ');
                        }
                    } else if (xhr.status === 413) {
                        errorMsg = 'Arquivo muito grande!';
                    } else if (xhr.status === 0) {
                        errorMsg = 'Erro de conexão. Verifique sua internet.';
                    } else if (xhr.status === 419) {
                        errorMsg = 'Sessão expirada. Por favor, recarregue a página.';
                    } else if (xhr.status === 422) {
                        errorMsg = 'Dados inválidos enviados ao servidor.';
                    }

                    reject(new Error(errorMsg));
                }
            });
        });
    }

    updateUI() {
        const submitButton = document.getElementById('btnEnviarDocumentos');
        if (!submitButton) return;

        const hasFiles = this.files.length > 0;
        submitButton.disabled = !hasFiles;

        if (hasFiles) {
            submitButton.innerHTML = `<i class="fas fa-upload mr-2"></i>Enviar Fotos (${this.files.length})`;

            // Atualizar contadores
            this.updateCounters();
        } else {
            submitButton.innerHTML = '<i class="fas fa-upload mr-2"></i>Enviar Fotos';
            this.resetCounters();
        }
    }

    updateCounters() {
        const contador = document.getElementById('contadorArquivos');
        const tamanhoTotal = document.getElementById('tamanhoTotal');

        if (contador) {
            contador.textContent = this.files.length;
        }

        if (tamanhoTotal) {
            const totalBytes = this.files.reduce((total, file) => total + file.size, 0);
            const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
            tamanhoTotal.textContent = `${totalMB} MB`;
        }
    }

    resetCounters() {
        const contador = document.getElementById('contadorArquivos');
        const tamanhoTotal = document.getElementById('tamanhoTotal');

        if (contador) contador.textContent = '0';
        if (tamanhoTotal) tamanhoTotal.textContent = '0 MB';
    }

    clear() {
        this.files = [];
        const previewContainer = document.getElementById('arquivosPreview');
        if (previewContainer) {
            previewContainer.innerHTML = '';
        }

        // Limpar inputs
        const fileInput = document.getElementById('arquivos_upload');
        if (fileInput) {
            fileInput.value = '';
        }

        const cameraInput = document.getElementById('camera_input');
        if (cameraInput) {
            cameraInput.value = '';
        }

        this.updateUI();
    }

    showNotification(message, type = 'info', duration = 3000) {
        // Usar a função global showNotification se existir
        if (typeof showNotification === 'function') {
            const icon = {
                'success': 'fas fa-check-circle',
                'warning': 'fas fa-exclamation-triangle',
                'danger': 'fas fa-exclamation-circle',
                'info': 'fas fa-info-circle'
            }[type] || 'fas fa-info-circle';

            showNotification(icon, message, type, duration);
        } else {
            // Fallback simples
            console.log(`${type.toUpperCase()}: ${message}`);
            alert(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Instanciar o gerenciador globalmente
const uploadManager = new UploadManager();

// Funções globais para compatibilidade (opcional, pois os botões já estão configurados)
function abrirCamera() {
    console.log('Função global abrirCamera chamada');
    uploadManager.openCamera();
}

function abrirGaleria() {
    console.log('Função global abrirGaleria chamada');
    uploadManager.openGallery();
}

function limparPreviews() {
    console.log('Função global limparPreviews chamada');
    uploadManager.clear();
}

function enviarArquivos() {
    console.log('Função global enviarArquivos chamada');
    uploadManager.startUpload();
}