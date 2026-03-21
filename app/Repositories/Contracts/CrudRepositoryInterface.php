<?php

namespace App\Repositories\Contracts;

interface CrudRepositoryInterface
{
    public function all();
    public function create(array $data);
    public function update(int $id, array $data);
}
