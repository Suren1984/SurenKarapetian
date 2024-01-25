using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace BodyMotionDto.Joints
{
    public class SegmentDto : INotifyPropertyChanged
    {
        /// <summary>
        /// Datetime of the record in ticks
        /// </summary>
        public long TimeStamp { get; set; }

        /// <summary>
        /// Time in milliseconds since the start of recording
        /// </summary>
        long duration;
        public long Duration
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

        long sequence;
        public long Sequence
        {
            get
            {
                return sequence;
            }

            set
            {
                if (value != sequence)
                {
                    sequence = value;
                    OnPropertyChanged();
                }
            }
        }

        public AnglesDto Angles { get; set; } = new();
        public PositionsDto? Positions { get; set; } = new();
        public DistancesDto? Distances { get; set; } = new();

        string? depthImage;

        public string? DepthImage
        {
            get
            {
                return this.depthImage;
            }

            set
            {
                if (value != this.depthImage)
                {
                    this.depthImage = value;
                    OnPropertyChanged();
                }
            }
        }

        byte[] depthImageBin;

        public byte[] DepthImageBin
        {
            get
            {
                return this.depthImageBin;
            }

            set
            {
                if (value != this.depthImageBin)
                {
                    this.depthImageBin = value;
                    OnPropertyChanged();
                }
            }
        }

        public SegmentDto(long timeStamp, long sequence, long duration)
        {
            TimeStamp = timeStamp;
            Sequence = sequence;
            Duration = duration;
        }

        public SegmentDto() { }

        public event PropertyChangedEventHandler PropertyChanged;
        protected virtual void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
