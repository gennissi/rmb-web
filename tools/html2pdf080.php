<?
        // reference the Dompdf namespace
        use Dompdf\Dompdf;
        use Dompdf\Options;
        
        require_once '../tools/dompdf080/autoload.inc.php';
                
        function html2pdf($html)
        {
                $options = new Options();
                $options -> set('isRemoteEnabled', true);
                $options -> set('dpi', '128');
                $options -> set('enable_html5_parser', true);
                
                $dompdf = new Dompdf($options);
                
                $dompdf->loadHtml($html);
                
                // (Optional) Setup the paper size and orientation
                $dompdf->setPaper('A4', 'landscape');
                
                // Render the HTML as PDF
                $dompdf->render();
                
                $result = $dompdf->output();
                                
                return $result;
        }
?>