<?
        // disable PHP xdebug module
        if(function_exists('xdebug_disable')) { xdebug_disable(); }
        error_reporting(E_ALL ^ E_DEPRECATED);
    
        // set 0 UTC timezone
        date_default_timezone_set('UTC');
    
        $gsValues = array();
        
        include ('../config.custom.php');
        include ('../config.php');
        include ('../tools/push.php');
        include ('../tools/sms.php');
        include ('../tools/webhook.php');
        if (version_compare(PHP_VERSION, '5.5.0', '>=')) { include ('../tools/email.php'); } else { include ('../tools/email52.php'); }
        
        if (file_exists('config.hosting.php') || @file_exists('../config.hosting.php'))
        {
                include ('../config.hosting.php');
        }
        
        // strip server name slashes
        $gsValues['NAME'] = stripcslashes($gsValues['NAME']);
        
        // check for last slash in root path
        if (substr($gsValues['PATH_ROOT'], -1) != '/')
        {
            $gsValues['PATH_ROOT'] .= '/';
        }
        
        // connect to mysql
        $ms = mysqli_connect($gsValues['DB_HOSTNAME'], $gsValues['DB_USERNAME'], $gsValues['DB_PASSWORD'], $gsValues['DB_NAME'], $gsValues['DB_PORT']);
        
        if (!$ms)
        {
            echo "Error connecting to database.";
            die;
        }
        
        mysqli_set_charset($ms, 'utf8');
        
        $q = "SET SESSION sql_mode = ''";
        $r = mysqli_query($ms, $q);
                
        // avoid injection attacks
        if(isset($_COOKIE))
        {
                $_COOKIE = initEscapeRecursive($_COOKIE);
        }
        
        if(isset($_POST))
        {
                $_POST = initEscapeRecursive($_POST);                
        }
        
        if(isset($_GET))
        {
                $_GET = initEscapeRecursive($_GET);
        }
        
        function initEscapeRecursive($arr)
        {
                if(is_array($arr)){
                        $temp_arr = array();
                        foreach ($arr as $key=>$value){
                                $temp_arr[initEscapeString($key)] = initEscapeRecursive($value);
                        }
                        return $temp_arr;
                }
                else
                {
                        return initEscapeString($arr);
                }
        }
        
        function initEscapeString($value)
        {
                global $ms;
                
                if(get_magic_quotes_gpc())
                {
                        $value = stripslashes($value);
                }
                
                $value = strip_tags($value);
                
                return mysqli_real_escape_string($ms, $value);
        }
?>