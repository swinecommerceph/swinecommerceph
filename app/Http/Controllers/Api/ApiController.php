<?php

namespace App\Http\Controllers\Api;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;
use Response;
use App\Http\Controllers\Controller;
use \Illuminate\Http\Response as Res;
 
/**
 * Class ApiController
 */
class ApiController extends Controller {
 
    
    protected $statusCode = Res::HTTP_OK;
    
    /**
     * Create a new authentication controller instance.
     *
     * @return void
     */
    public function __construct()
    {

    }

    public function getStatusCode()
    {
        return $this->statusCode;
    }

    public function setStatusCode($statusCode)
    {
        $this->statusCode = $statusCode;
        return $this;
    }

    public function respondCreated($message, $data=null)
    {
        return $this->respond([
            'status' => 'success',
            'status_code' => Res::HTTP_CREATED,
            'message' => $message,
            'data' => $data
        ]);
    }

    /**
     * @param Paginator $paginate
     * @param $data
     * @return mixed
     */
    protected function respondWithPagination(Paginator $paginate, $data, $message)
    { 
        $data = array_merge($data, [
            'paginator' => [
                'total_count'  => $paginate->total(),
                'total_pages' => ceil($paginate->total() / $paginate->perPage()),
                'current_page' => $paginate->currentPage(),
                'limit' => $paginate->perPage(),
            ]
        ]);
 
        return $this->respond([
 
            'status' => 'success',
            'status_code' => Res::HTTP_OK,
            'message' => $message,
            'data' => $data
 
        ]);
    }

    public function respondNotFound($message = 'Not Found!')
    {
        return $this->respond([
 
            'status' => 'error',
            'status_code' => Res::HTTP_NOT_FOUND,
            'message' => $message,
 
        ]);
    }

    public function respondInternalError($message)
    {
        return $this->respond([

            'status' => 'error',
            'status_code' => Res::HTTP_INTERNAL_SERVER_ERROR,
            'message' => $message,

        ]);
    }

    public function respondValidationError($message, $errors)
    {
        return $this->respond([
 
            'status' => 'error',
            'status_code' => Res::HTTP_UNPROCESSABLE_ENTITY,
            'message' => $message,
            'data' => $errors
 
        ]);
    }

    public function respond($data, $headers = [])
    {
        return Response::json($data, $this->getStatusCode(), $headers);
    }

    public function respondWithError($message)
    {
        return $this->respond([
 
            'status' => 'error',
            'status_code' => Res::HTTP_UNAUTHORIZED,
            'message' => $message,

        ]);
    }
}