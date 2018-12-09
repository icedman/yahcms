<?php

namespace App\Mongo;

use MongoDB\Client;
use MongoDB\BSON\ObjectID;

class MongoDB
{
  protected $mongo;

  public function __construct($uri, $database) {
      $this->mongo = (new Client)->selectDatabase($database);
  }

  public function db () {
    return $this->mongo;
  }

  public function hello() {
    return "hello world";
  }

  // helper
  public function convertObjectIds(&$data) {
    $t = gettype($data);

    if ($t === 'object') {
      $prop = '$oid';
      if (!empty($data->$prop)) {
        $data = new ObjectID($data->$prop);
        return;
      }

      foreach($data as $n => &$v) {
        $this->convertObjectIds($v);
      }
    }
    if ($t === 'array') {
      foreach($data as &$v) {
        $this->convertObjectIds($v);
      }
    }
  }

  public function find($query, $resource, $id = null) {
      $collection = $this->db()->selectCollection($resource);

      if (gettype($query) === 'object') {
        $arr = [];
        foreach($query as $n => $v) {
          $arr[$n] = $v;
        }
        $query = $arr;
      }

      // return [ $resource, $query ];

      function startsWith ($string, $startString) 
      { 
          $len = strlen($startString); 
          return (substr($string, 0, $len) === $startString); 
      }

      function endsWith($string, $endString) 
      { 
          $len = strlen($endString); 
          if ($len == 0) { 
              return true; 
          } 
          return (substr($string, -$len) === $endString); 
      }

      // build query
      $q = []; // match
      $s = []; // sort
      $options = ['limit' => 30];

      $filters = ['_eq', '_ne', '_lt', '_gt', '_lte', '_gte', '_regex', '_exists'];

      foreach($query as $n => $v) {

        // handle types
        if (is_numeric($v)) {
          if (strpos($v, '.') != false) {
            $v = floatval($v);
          } else {
            $v = intval($v);
          }
        }
        if ($v === 'true') {
          $v = true;
        }
        if ($v === 'false') {
          $v = false;
        }

        // handle dates

        if (startsWith($n, '_')) {

          // ---------------
          // sort
          // ---------------
          // ASC: GET /users?_sort=email:ASC
          // DESC: GET /users?_sort=email:DESC

          if ($n === '_sort') {
            $ss = explode(':', $v . ':asc');
            $s[$ss[0]] = strtolower($ss[1]) === 'desc' ? -1 : 1;
            $options['sort'] = $s;
          }

          // ---------------
          // limit
          // ---------------
          // limit
          // start
          if ($n == '_limit') {
            $options['limit'] = $v;
          }
          if ($n === '_skip') {
            $options['skip'] = $v;
          }

          continue;
        }

        // ---------------
        // filters
        // ---------------
        // =: Equals
        // _ne: Not equals
        // _lt: Lower than
        // _gt: Greater than
        // _lte: Lower than or equal to
        // _gte: Greater than or equal to
        // _regex: Regular Expression ( ^starts ends$ )
        // _exists: Field exists (true or false)
        $eq = true;
        foreach($filters as $f) {
          if (endsWith($n, $f)) {
            $q[str_replace($f, '', $n)] = [str_replace('_', '$', $f) => $v];
            $eq = false;
            break;
          }
        }

        if ($eq) {
          $q[$n] = ['$eq' => $v];
        }
      }

      if ($id) {
        $q['_id'] = new ObjectID($id);
      }

      if (!empty($query['_count'])) {
        return $collection->count($q);
      }

      // ---------------
      // lookup
      // ---------------
      // {
      //    $lookup:
      //      {
      //        from: <collection to join>,
      //        localField: <field from the input documents>,
      //        foreignField: <field from the documents of the "from" collection>,
      //        as: <output array field>
      //      }
      // }

      $lookup = [];
      if (!empty($query['_lookup'])) {
        $ql = $query['_lookup'];
        if ($ql) {
          foreach($ql as $field => $col) {
            $l = [
              'from' => $col,
              'localField' => $field,
              'foreignField' => '_id',
              'as' => '_' . $field
            ];
            $lookup[] = $l;
          }
        }
      }

      $pipeline = []; 
      if (count($q)) {
        $pipeline[] = ['$match' => $q ];
      }
      if (!empty($options['limit'])) {
        $pipeline[] = ['$limit' => $options['limit']];
      }
      if (!empty($options['skip'])) {
        $pipeline[] = ['$skip' => $options['skip']];
      }
      if (!empty($options['sort'])) {
        $pipeline[] = ['$sort' => $options['sort']];
      }
      if (count($lookup)) {
        foreach($lookup as $l) {
          $pipeline[] = ['$lookup' => $l];
        }
      }

      // dump only pipeline
      if (!empty($query['_pipeline'])) {
        return [ 'pipeline' => $pipeline ];
      }

      return $collection->aggregate($pipeline)
        ->toArray();
    }
}