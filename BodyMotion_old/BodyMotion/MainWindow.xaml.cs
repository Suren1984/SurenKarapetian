using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using Syncfusion.Windows.Tools.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using BodyMotion.Modules.PatientsData.Controls;
using BodyMotionCore;
using System.Configuration;
using System.Security.Policy;
using System.Threading;
using BodyMotionDto.Joints;
using BodyMotionDto;

namespace BodyMotion
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Syncfusion.Windows.Tools.Controls.RibbonWindow
    {
        string _patientID = "528ebb31-7b4b-4526-b77f-498eaa465d7c";
        Guid _sessionId;
        List<FileMetadata> _filesList;

        private string _apiUrl = Properties.Settings.Default.HttpListenerUrl;
        private string _apiKey = string.Empty;
        private string _apiKeySecret = string.Empty;
        private Timer _timer = null;
        private CallbackTransferClass _transferClass;

        public MainWindow()
        {
            InitializeComponent();
            diagnosticControl.DataContext = new SegmentDto();
            DataContext = new GeneralTransferData() { Duration = "00:00:00.0" };
        }

        private async void helpBtn_Click(object sender, RoutedEventArgs e)
        {
            //var x = await BodyMotionCore.CoreServices.Instance.GetTestStringDataAsync("http://www.magnusek.net");
            BodyMotion.Modules.About.Windows.Help win = new BodyMotion.Modules.About.Windows.Help();
            win.Show();
        }

        private void aboutBtn_Click(object sender, RoutedEventArgs e)
        {
            BodyMotion.Modules.About.Windows.About win = new BodyMotion.Modules.About.Windows.About();
            win.Show();
        }

        private void sqlBtn_Click(object sender, RoutedEventArgs e)
        {
            BodyMotion.Modules.Settings.Windows.SqlDatabase win = new BodyMotion.Modules.Settings.Windows.SqlDatabase();
            win.Show();
        }

        private void ftpBtn_Click(object sender, RoutedEventArgs e)
        {
            BodyMotion.Modules.Settings.Windows.FtpDatabase win = new BodyMotion.Modules.Settings.Windows.FtpDatabase();
            win.Show();
        }

        // https://stackoverflow.com/questions/28545489/c-sharp-best-way-to-run-a-function-every-second-timer-vs-thread
        private async void diagnosticRunBtn_Click(object sender, RoutedEventArgs e)
        {
            var button = (RibbonButton)sender;
            if (button.IsSelected)
            {

                // command odstartovat diagnostiku
                _sessionId = await BodyMotionCore.CoreServices.Instance.StartRecorderAsync(_apiUrl, Guid.Parse(_patientID), 30);
                _transferClass = new CallbackTransferClass(_apiUrl, _sessionId, diagnosticControl.DataContext as SegmentDto, DataContext as GeneralTransferData);
                _timer = new Timer(BodyMotionCore.CoreServices.Instance.CallbackRunAsync, _transferClass, TimeSpan.FromSeconds(1), TimeSpan.FromSeconds(0.08)); // 0.1 je perioda
            }
            else if (!button.IsSelected && _timer != null)
            {
                _timer.Dispose();
                // command zastavit diagnostiku
                await BodyMotionCore.CoreServices.Instance.StopRecorderAsync(_apiUrl);
            }
            else
            {
                // command zastavit diagnostiku
                await BodyMotionCore.CoreServices.Instance.StopRecorderAsync(_apiUrl);
            }
        }


        private void diagnosticCalibrationBtn_Click(object sender, RoutedEventArgs e)
        {
            var button = (RibbonButton)sender;
            if (button.IsSelected)
            {
                // TODO: komand odstartovat kalibraciu
                // _transferClass = new CallbackTransferClass(_apiUrl.ToString ,???, diagnosticControl.DataContext as AnglesDto, DataContext as GeneralTransferData);
                // _timer = new Timer(BodyMotionCore.CoreServices.Instance.CallbackCalibrationAsync, _transferClass, TimeSpan.FromSeconds(1), TimeSpan.FromSeconds(5)); // 5 je perioda

            }
            else if (!button.IsSelected && _timer != null)
            {
                _timer.Dispose();
                // TODO: command zastavit
            }
        }

        private void MeasureBtn_Click(object sender, RoutedEventArgs e)
        {

        }

        private async void lastMeasurementsListBtn_Click(object sender, RoutedEventArgs e)
        {
            _filesList = await BodyMotionCore.CoreServices.Instance.GetLastMeasurementsAsync(_apiUrl, Guid.Parse(_patientID));
        }

        private async void downloadMeasurementsBtn_Click(object sender, RoutedEventArgs e)
        {
            if(_filesList != null)
            {
               await BodyMotionCore.CoreServices.Instance.DownloadMeasurementsAsync(_apiUrl, Guid.Parse(_patientID), _filesList[0].Name);
            }
        }
    }
}
