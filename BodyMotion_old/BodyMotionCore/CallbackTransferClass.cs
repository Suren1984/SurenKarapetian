using System;
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace BodyMotionCore
{
    public class CallbackTransferClass 
    {
        public CallbackTransferClass(string uRL, Guid sessionId, object transferredObject, object transferredObject2)
        {
            URL = uRL;
            SessionId = sessionId;
            TransferredObject = transferredObject;
            TransferredObject2 = transferredObject2;
          //  Duration = duration;
        }

        public string URL { get; set; }

        public Guid SessionId { get; set; }

        public object TransferredObject { get; set; }

       // public TextBlock Duration { get; set; }

        public object TransferredObject2 { get; set; }

        public event PropertyChangedEventHandler? PropertyChanged;
    }

    public class GeneralTransferData : INotifyPropertyChanged
    {
        //public string Duration { get; set; }

        string duration;
        public string Duration
        {
            get
            {
                return this.duration;
            }

            set
            {
                if (value != this.duration)
                {
                    this.duration = value;
                    OnPropertyChanged();
                }
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;
        protected virtual void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
