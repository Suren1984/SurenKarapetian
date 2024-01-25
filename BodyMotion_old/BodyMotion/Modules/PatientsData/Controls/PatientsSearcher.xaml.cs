using Syncfusion.Windows.Controls.Input;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
//using Syncfusion.Windows.Controls.Primitives;

namespace BodyMotion.Modules.PatientsData.Controls
{
    /// <summary>
    /// Interaction logic for PatientsSearcher.xaml
    /// </summary>
    public partial class PatientsSearcher : UserControl
    {
        public PatientsSearcher()
        {
            InitializeComponent();
        }

        private void searchPatientBtn_Click(object sender, RoutedEventArgs e)
        {
            ;
        }

        private void searchPatientTxt_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Enter)
            {
                ;
            }
        }
    }
}
