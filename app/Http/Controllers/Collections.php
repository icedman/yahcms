<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use MongoDB\BSON\ObjectID;

class Collections extends Controller
{
    public function index(Request $request) {
      return $this->database->hello();
    }

    public function find(Request $request, $resource, $id = null) {
      $result = $this->database->find($request->query, $resource, $id);
      // deep expand?
      return $result;
    }

    public function create(Request $request, $resource) {
      $collection = $this->database->db()->selectCollection($resource);
      $data = json_decode($request->getContent());
      $this->database->convertObjectIds($data);
      return $collection->insertOne($data)->getInsertedId();
    }

    public function update(Request $request, $resource, $id) {
      $collection = $this->database->db()->selectCollection($resource);
      $data = json_decode($request->getContent());      

      unset($data->_id);

      $this->database->convertObjectIds($data);
      return $collection->updateOne(['_id' => new ObjectID($id)], [ '$set' => $data ])->getModifiedCount();
    }

    public function delete(Request $request, $resource, $id) {
      $collection = $this->database->db()->selectCollection($resource);
      return $collection->deleteOne(['_id' => new ObjectID($id)])->getDeletedCount();
    }
}
