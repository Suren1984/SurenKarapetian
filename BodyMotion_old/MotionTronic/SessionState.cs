using BodyMotionDto.Joints;
using Microsoft.Azure.Kinect.BodyTracking;
using System.Diagnostics;

namespace MotionTronic
{
    public static class SessionState
    {
        public static Guid? SessionId { get; set; } = null;
        public static Stopwatch Stopwatch { get; set; } = new Stopwatch();

        // Joints data processing
        /// <summary>
        /// List of all the calculations done during recording session. One Segment contains all the calculations done on one captured frame.
        /// </summary>
        public static List<SegmentDto> Segments { get; set; } = new();

        public static Skeleton? KinectSkeleton { get; set; } = null;

        // Depth Image
        public static ushort[]? DepthImagePixels { get; set; }
        public static int DepthImageWidth { get; set; }
        public static int DepthImageHeight { get; set; }
        public static int DepthImageStride { get; set; }

        public static void Clean()
        {
            Segments = new();
            KinectSkeleton = null;
        }
    }
}
