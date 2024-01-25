using BodyMotionDataProcessing;
using BodyMotionDto.Joints;
using Microsoft.Azure.Kinect.BodyTracking;
using MotionTronic.Services.Interfaces;

namespace MotionTronic.Services
{
    /// <summary>
    /// Service providing interaction with BodyMotionDataProcessing library for calculations done on captured image frame and skeleton from Azure Kinect device
    /// </summary>
    public class KinectCalculationsService : ICalculationsService
    {
        private readonly ILogger<KinectCalculationsService> _logger;

        public KinectCalculationsService(ILogger<KinectCalculationsService> logger)
        {
            _logger = logger;
        }

        public AnglesDto GetAngles(Frame frame)
        {
            AnglesDto anglesJointsDto = new();

            // Calculate and add all angles
            anglesJointsDto.ShoulderAbductionTransversalAdductionLeft = (int?)Kinect.ShoulderTransversalAA(frame, Side.Left);
            anglesJointsDto.ShoulderAbductionTransversalAdductionRight = (int?)Kinect.ShoulderTransversalAA(frame, Side.Right);
            anglesJointsDto.ShoulderAbductionFrontalAdductionLeft = (int?)Kinect.ShoulderFrontalAA(frame, Side.Left);
            anglesJointsDto.ShoulderAbductionFrontalAdductionRight = (int?)Kinect.ShoulderFrontalAA(frame, Side.Right);
            anglesJointsDto.ShoulderFlexionExtensionLeft = (int?)Kinect.ShoulderFE(frame, Side.Left);
            anglesJointsDto.ShoulderFlexionExtensionRight = (int?)Kinect.ShoulderFE(frame, Side.Right);
            anglesJointsDto.ElbowFlexionExtensionLeft = (int?)Kinect.ElbowFE(frame, Side.Left);
            anglesJointsDto.ElbowFlexionExtensionRight = (int?)Kinect.ElbowFE(frame, Side.Right);
            anglesJointsDto.SpineRotation = (int?)Kinect.SpineRotation(frame);
            anglesJointsDto.SpineLateroflexion = (int?)Kinect.SpineLateroflexion(frame);
            anglesJointsDto.ThoracicFlexion = (int?)Kinect.ThoracicFlexion(frame);
            anglesJointsDto.CervicalFlexion = (int?)Kinect.CervicalFlexion(frame);
            anglesJointsDto.LumbarFlexion = (int?)Kinect.LumbarFlexion(frame);
            anglesJointsDto.HipAbductionTransversalAdductionLeft = (int?)Kinect.HipTransversalAA(frame, Side.Left);
            anglesJointsDto.HipAbductionTransversalAdductionRight = (int?)Kinect.HipTransversalAA(frame, Side.Right);
            anglesJointsDto.HipAbductionFrontalAdductionLeft = (int?)Kinect.HipFrontalAA(frame, Side.Left);
            anglesJointsDto.HipAbductionFrontalAdductionRight = (int?)Kinect.HipFrontalAA(frame, Side.Right);
            anglesJointsDto.HipFlexionExtensionLeft = (int?)Kinect.HipFE(frame, Side.Left);
            anglesJointsDto.HipFlexionExtensionRight = (int?)Kinect.HipFE(frame, Side.Right);
            anglesJointsDto.KneeAbductionAdductionLeft = (int?)Kinect.KneeTransversalAA(frame, Side.Left);
            anglesJointsDto.KneeAbductionAdductionRight = (int?)Kinect.KneeTransversalAA(frame, Side.Right);
            anglesJointsDto.KneeFlexionExtensionLeft = (int?)Kinect.KneeFE(frame, Side.Left);
            anglesJointsDto.KneeFlexionExtensionRight = (int?)Kinect.KneeFE(frame, Side.Right);

            return anglesJointsDto;
        }

        //public AnglesDto GetAnglesMock(Stopwatch stopwatch, long sequence)
        //{
        //    AnglesDto anglesJointsDto = new();

        //    Random randomAngle = new();
        //    anglesJointsDto.ShoulderAbductionTransversalAdductionLeft = GetRandomAngle(randomAngle);
        //    anglesJointsDto.ShoulderAbductionTransversalAdductionRight = GetRandomAngle(randomAngle);
        //    anglesJointsDto.ShoulderAbductionFrontalAdductionLeft = GetRandomAngle(randomAngle);
        //    anglesJointsDto.ShoulderAbductionFrontalAdductionRight = GetRandomAngle(randomAngle);
        //    anglesJointsDto.ShoulderFlexionExtensionLeft = GetRandomAngle(randomAngle);
        //    anglesJointsDto.ShoulderFlexionExtensionRight = GetRandomAngle(randomAngle);
        //    anglesJointsDto.ElbowFlexionExtensionLeft = GetRandomAngle(randomAngle);
        //    anglesJointsDto.ElbowFlexionExtensionRight = GetRandomAngle(randomAngle);
        //    anglesJointsDto.SpineRotation = GetRandomAngle(randomAngle);
        //    anglesJointsDto.SpineLateroflexion = GetRandomAngle(randomAngle);
        //    anglesJointsDto.ThoracicFlexion = GetRandomAngle(randomAngle);
        //    anglesJointsDto.CervicalFlexion = GetRandomAngle(randomAngle);
        //    anglesJointsDto.LumbarFlexion = GetRandomAngle(randomAngle);
        //    anglesJointsDto.HipAbductionTransversalAdductionLeft = GetRandomAngle(randomAngle);
        //    anglesJointsDto.HipAbductionTransversalAdductionRight = GetRandomAngle(randomAngle);
        //    anglesJointsDto.HipAbductionFrontalAdductionLeft = GetRandomAngle(randomAngle);
        //    anglesJointsDto.HipAbductionFrontalAdductionRight = GetRandomAngle(randomAngle);
        //    anglesJointsDto.HipFlexionExtensionLeft = GetRandomAngle(randomAngle);
        //    anglesJointsDto.HipFlexionExtensionRight = GetRandomAngle(randomAngle);
        //    anglesJointsDto.KneeAbductionAdductionLeft = GetRandomAngle(randomAngle);
        //    anglesJointsDto.KneeAbductionAdductionRight = GetRandomAngle(randomAngle);
        //    anglesJointsDto.KneeFlexionExtensionLeft = GetRandomAngle(randomAngle);
        //    anglesJointsDto.KneeFlexionExtensionRight = GetRandomAngle(randomAngle);

        //    return anglesJointsDto;
        //}

        //private int GetRandomAngle(Random random)
        //{
        //    return random.Next(-180, 181);
        //}

        public PositionsDto GetPositions(Frame currentFrame, Skeleton? previousSkeleton, double time)
        {
            var result = Kinect.GetJointsPositions(currentFrame, previousSkeleton, time);

            return result == null ? new PositionsDto() : result; 
        }

        public DistancesDto GetDistances()
        {
            var result = Kinect.GetJointsDistances(SessionState.KinectSkeleton);

            return result == null ? new DistancesDto() : result;
        }

        //public PositionsDto GetPositionsMock()
        //{
        //    Random random = new();

        //    var result = new PositionsDto();
        //    var jointNames = ((JointId[])Enum.GetValues(typeof(JointId))).ToList();
        //    jointNames.Remove(JointId.Count);
        //    foreach (var jointId in jointNames)
        //    {
        //        result.Joints.Add(new JointDto()
        //        {
        //            Name = jointId.ToString(),
        //            Confidence = (short)random.Next(0, 4),
        //            Position = new System.Numerics.Vector3(random.Next(0, 100), random.Next(0, 100), random.Next(0, 100)),
        //            Speed = random.NextDouble()
        //        });
        //    }

        //    return result;
        //}

        //public DistancesDto GetDistancesMock()
        //{
        //    Random random = new();

        //    var result = new DistancesDto();            

        //    result.PelvisNeck = GetRandomDistance(random);
        //    result.ShoukderElbowRight = GetRandomDistance(random);
        //    result.ShoukderElbowLeft = GetRandomDistance(random);
        //    result.ElbowWristRight = GetRandomDistance(random);
        //    result.ElbowWristLeft = GetRandomDistance(random);
        //    result.HipKneeRight = GetRandomDistance(random);
        //    result.HipKneeLeft = GetRandomDistance(random);
        //    result.KneeAnkleRight = GetRandomDistance(random);
        //    result.KneeAnkleLeft = GetRandomDistance(random);

        //    return result;
        //}

        //private int GetRandomDistance(Random random)
        //{
        //    return random.Next(0, 501);
        //}
    }
}
