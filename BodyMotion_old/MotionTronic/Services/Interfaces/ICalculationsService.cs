using BodyMotionDto.Joints;
using Microsoft.Azure.Kinect.BodyTracking;

namespace MotionTronic.Services.Interfaces
{
    /// <summary>
    /// Service providing interaction with BodyMotionDataProcessing library for calculations done on captured image frame and skeleton
    /// </summary>
    public interface ICalculationsService
    {
        PositionsDto GetPositions(Frame currentFrame, Skeleton? previousSkeleton, double time);
        //PositionsDto GetPositionsMock();
        AnglesDto GetAngles(Frame frame);
        //AnglesDto GetAnglesMock(Stopwatch stopwatch, long sequence);
        DistancesDto GetDistances();
        //DistancesDto GetDistancesMock();
    }
}
