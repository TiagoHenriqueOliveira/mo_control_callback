$(document).ready(
	function() {
		var MaskTelefone = function(val) {
			return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000'
					: '(00) 0000-00009';
		}, Options = {
			onKeyPress : function(val, e, field, options)
			{
				field.mask(MaskTelefone.apply({}, arguments), options);
			}
		};
	
		$('.date').mask('00/00/0000');
		$('.time').mask('00:00');
		$('.date_time').mask('00/00/0000 00:00:00');
		$('.cep').mask('00000-000');
		$('.fone_ddd').mask('(00) 0000-0000');
		$('.fone').mask('0000-0000');
		$('.celular_ddd').mask('(00) 00000-0000');
		$('.celular').mask('00000-0000');
		$('.mixed').mask('AAA 000-S0S');
		$('.ip').mask('099.099.099.099');
		$('.percentual').mask('##0,00%', {reverse : true});
		$(".money").mask("#.##0,00", {reverse: true});
		$(".numeric").mask("#.##0,000", {reverse: true});
	
		$('#cpf').mask('000.000.000-00');
		$('.cpf').mask('000.000.000-00');
		$('#cnpj').mask('00.000.000/0000-00');
		$('.cnpj').mask('00.000.000/0000-00');
		$('#tel').mask(MaskTelefone, Options);
		$('.tel').mask(MaskTelefone, Options);
		$('#cep').mask('00.000-000');
		$('.cep').mask('00.000-000');
		$(".dinheiro").mask("#.##0,00", {reverse: true});
		$(".numero").mask("#.##0,000", {reverse: true});
	}
);