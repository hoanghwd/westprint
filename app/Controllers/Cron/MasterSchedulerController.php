<?php
namespace App\Controllers\Cron;
use App\Controllers\baseController;
use App\Models\Cron\MasterScheduler;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\HttpFoundation\Request;


class MasterSchedulerController extends baseController
{
    /**
     * MasterSchedulerController constructor.
     */
    function __construct()
    {
        parent::__construct("cron/masterscheduler");
    }


    public function masterschedulerAction(RouteCollection $routes)
    {
        $request = $this->getHttpRequest();
        $masterScheduleHdl = new MasterScheduler($request);

        $this->render($masterScheduleHdl);
    }

}//End of class