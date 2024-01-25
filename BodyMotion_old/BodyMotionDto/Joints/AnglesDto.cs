using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace BodyMotionDto.Joints
{
    public class AnglesDto : INotifyPropertyChanged
    {
        #region Upper limbs
        //  public int? ShoulderAbductionFrontalAdductionRight { get; set; }

        int? shoulderAbductionFrontalAdductionRight;
        public int? ShoulderAbductionFrontalAdductionRight
        {
            get
            {
                return shoulderAbductionFrontalAdductionRight;
            }

            set
            {
                if (value != shoulderAbductionFrontalAdductionRight)
                {
                    shoulderAbductionFrontalAdductionRight = value;
                    OnPropertyChanged();
                }
            }
        }

        //public int? ShoulderAbductionFrontalAdductionLeft { get; set; }
        int? shoulderAbductionFrontalAdductionLeft;
        public int? ShoulderAbductionFrontalAdductionLeft
        {
            get
            {
                return shoulderAbductionFrontalAdductionLeft;
            }

            set
            {
                if (value != shoulderAbductionFrontalAdductionLeft)
                {
                    shoulderAbductionFrontalAdductionLeft = value;
                    OnPropertyChanged();
                }
            }
        }


        //public int? ShoulderAbductionTransversalAdductionRight { get; set; }
        int? shoulderAbductionTransversalAdductionRight;
        public int? ShoulderAbductionTransversalAdductionRight
        {
            get
            {
                return shoulderAbductionTransversalAdductionRight;
            }

            set
            {
                if (value != shoulderAbductionTransversalAdductionRight)
                {
                    shoulderAbductionTransversalAdductionRight = value;
                    OnPropertyChanged();
                }
            }
        }



        //public int? ShoulderAbductionTransversalAdductionLeft { get; set; }
        int? shoulderAbductionTransversalAdductionLeft;
        public int? ShoulderAbductionTransversalAdductionLeft
        {
            get
            {
                return shoulderAbductionTransversalAdductionLeft;
            }

            set
            {
                if (value != shoulderAbductionTransversalAdductionLeft)
                {
                    shoulderAbductionTransversalAdductionLeft = value;
                    OnPropertyChanged();
                }
            }
        }



        //public int? ShoulderFlexionExtensionRight { get; set; }
        int? shoulderFlexionExtensionRight;
        public int? ShoulderFlexionExtensionRight
        {
            get
            {
                return shoulderFlexionExtensionRight;
            }

            set
            {
                if (value != shoulderFlexionExtensionRight)
                {
                    shoulderFlexionExtensionRight = value;
                    OnPropertyChanged();
                }
            }
        }


        //public int? ShoulderFlexionExtensionLeft { get; set; }
        int? shoulderFlexionExtensionLeft;
        public int? ShoulderFlexionExtensionLeft
        {
            get
            {
                return shoulderFlexionExtensionLeft;
            }

            set
            {
                if (value != shoulderFlexionExtensionLeft)
                {
                    shoulderFlexionExtensionLeft = value;
                    OnPropertyChanged();
                }
            }
        }


        //public int? ElbowFlexionExtensionRight { get; set; }
        int? elbowFlexionExtensionRight;
        public int? ElbowFlexionExtensionRight
        {
            get
            {
                return elbowFlexionExtensionRight;
            }

            set
            {
                if (value != elbowFlexionExtensionRight)
                {
                    elbowFlexionExtensionRight = value;
                    OnPropertyChanged();
                }
            }
        }


        //public int? ElbowFlexionExtensionLeft { get; set; }
        int? elbowFlexionExtensionLeft;
        public int? ElbowFlexionExtensionLeft
        {
            get
            {
                return elbowFlexionExtensionLeft;
            }

            set
            {
                if (value != elbowFlexionExtensionLeft)
                {
                    elbowFlexionExtensionLeft = value;
                    OnPropertyChanged();
                }
            }
        }


        #endregion Upper limbs

        #region Lower limbs
        //public int? HipFlexionExtensionRight { get; set; }
        int? hipFlexionExtensionRight;
        public int? HipFlexionExtensionRight
        {
            get
            {
                return hipFlexionExtensionRight;
            }

            set
            {
                if (value != hipFlexionExtensionRight)
                {
                    hipFlexionExtensionRight = value;
                    OnPropertyChanged();
                }
            }
        }

        //public int? HipFlexionExtensionLeft { get; set; }
        int? hipFlexionExtensionLeft;
        public int? HipFlexionExtensionLeft
        {
            get
            {
                return hipFlexionExtensionLeft;
            }

            set
            {
                if (value != hipFlexionExtensionLeft)
                {
                    hipFlexionExtensionLeft = value;
                    OnPropertyChanged();
                }
            }
        }


        //public int? KneeFlexionExtensionRight { get; set; }
        int? kneeFlexionExtensionRight;
        public int? KneeFlexionExtensionRight
        {
            get
            {
                return kneeFlexionExtensionRight;
            }

            set
            {
                if (value != kneeFlexionExtensionRight)
                {
                    kneeFlexionExtensionRight = value;
                    OnPropertyChanged();
                }
            }
        }

        //public int? KneeFlexionExtensionLeft { get; set; }
        int? kneeFlexionExtensionLeft;
        public int? KneeFlexionExtensionLeft
        {
            get
            {
                return kneeFlexionExtensionLeft;
            }

            set
            {
                if (value != kneeFlexionExtensionLeft)
                {
                    kneeFlexionExtensionLeft = value;
                    OnPropertyChanged();
                }
            }
        }



        //public int? HipAbductionFrontalAdductionRight { get; set; }
        int? hipAbductionFrontalAdductionRight;
        public int? HipAbductionFrontalAdductionRight
        {
            get
            {
                return hipAbductionFrontalAdductionRight;
            }

            set
            {
                if (value != hipAbductionFrontalAdductionRight)
                {
                    hipAbductionFrontalAdductionRight = value;
                    OnPropertyChanged();
                }
            }
        }


        //public int? HipAbductionFrontalAdductionLeft { get; set; }
        int? hipAbductionFrontalAdductionLeft;
        public int? HipAbductionFrontalAdductionLeft
        {
            get
            {
                return hipAbductionFrontalAdductionLeft;
            }

            set
            {
                if (value != hipAbductionFrontalAdductionLeft)
                {
                    hipAbductionFrontalAdductionLeft = value;
                    OnPropertyChanged();
                }
            }
        }


        //public int? HipAbductionTransversalAdductionRight { get; set; }
        int? hipAbductionTransversalAdductionRight;
        public int? HipAbductionTransversalAdductionRight
        {
            get
            {
                return hipAbductionTransversalAdductionRight;
            }

            set
            {
                if (value != hipAbductionTransversalAdductionRight)
                {
                    hipAbductionTransversalAdductionRight = value;
                    OnPropertyChanged();
                }
            }
        }

        //public int? HipAbductionTransversalAdductionLeft { get; set; }
        int? hipAbductionTransversalAdductionLeft;
        public int? HipAbductionTransversalAdductionLeft
        {
            get
            {
                return hipAbductionTransversalAdductionLeft;
            }

            set
            {
                if (value != hipAbductionTransversalAdductionLeft)
                {
                    hipAbductionTransversalAdductionLeft = value;
                    OnPropertyChanged();
                }
            }
        }



        // public int? KneeAbductionAdductionRight { get; set; }
        int? kneeAbductionAdductionRight;
        public int? KneeAbductionAdductionRight
        {
            get
            {
                return kneeAbductionAdductionRight;
            }

            set
            {
                if (value != kneeAbductionAdductionRight)
                {
                    kneeAbductionAdductionRight = value;
                    OnPropertyChanged();
                }
            }
        }

        //public int? KneeAbductionAdductionLeft { get; set; }
        int? kneeAbductionAdductionLeft;
        public int? KneeAbductionAdductionLeft
        {
            get
            {
                return kneeAbductionAdductionLeft;
            }

            set
            {
                if (value != kneeAbductionAdductionLeft)
                {
                    kneeAbductionAdductionLeft = value;
                    OnPropertyChanged();
                }
            }
        }


        #endregion Lower limbs

        #region Torso
        //public int? SpineRotation { get; set; }
        int? spineRotation;
        public int? SpineRotation
        {
            get
            {
                return spineRotation;
            }

            set
            {
                if (value != spineRotation)
                {
                    spineRotation = value;
                    OnPropertyChanged();
                }
            }
        }


        //public int? SpineLateroflexion { get; set; }
        int? spineLateroflexion;
        public int? SpineLateroflexion
        {
            get
            {
                return spineLateroflexion;
            }

            set
            {
                if (value != spineLateroflexion)
                {
                    spineLateroflexion = value;
                    OnPropertyChanged();
                }
            }
        }


        //public int? CervicalFlexion { get; set; }
        int? cervicalFlexion;
        public int? CervicalFlexion
        {
            get
            {
                return cervicalFlexion;
            }

            set
            {
                if (value != cervicalFlexion)
                {
                    cervicalFlexion = value;
                    OnPropertyChanged();
                }
            }
        }

        //public int? ThoracicFlexion { get; set; }
        int? thoracicFlexion;
        public int? ThoracicFlexion
        {
            get
            {
                return thoracicFlexion;
            }

            set
            {
                if (value != thoracicFlexion)
                {
                    thoracicFlexion = value;
                    OnPropertyChanged();
                }
            }
        }


        //public int? LumbarFlexion { get; set; }
        int? lumbarFlexion;
        public int? LumbarFlexion
        {
            get
            {
                return lumbarFlexion;
            }

            set
            {
                if (value != lumbarFlexion)
                {
                    lumbarFlexion = value;
                    OnPropertyChanged();
                }
            }
        }


        #endregion Torso

        public AnglesDto()
        {
        }

        public event PropertyChangedEventHandler PropertyChanged;
        protected virtual void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
