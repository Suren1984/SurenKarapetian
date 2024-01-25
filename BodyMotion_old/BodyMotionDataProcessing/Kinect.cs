using BodyMotionDto.Joints;
using Microsoft.Azure.Kinect.BodyTracking;
using System.Numerics;

namespace BodyMotionDataProcessing
{
    public static class Kinect
    {
        public static DistancesDto? GetJointsDistances(Skeleton? skeleton)
        {
            if (skeleton == null) return null;

            var result = new DistancesDto();

            var shoulderRight = skeleton.Value.GetJoint(JointId.ShoulderRight);
            var shoulderLeft = skeleton.Value.GetJoint(JointId.ShoulderLeft);
            var elbowRight = skeleton.Value.GetJoint(JointId.ElbowRight);
            var elbowLeft = skeleton.Value.GetJoint(JointId.ElbowLeft);
            var wristRight = skeleton.Value.GetJoint(JointId.WristRight);
            var wristLeft = skeleton.Value.GetJoint(JointId.WristLeft);
            var hipRight = skeleton.Value.GetJoint(JointId.HipRight);
            var hipLeft = skeleton.Value.GetJoint(JointId.HipLeft);
            var kneeRight = skeleton.Value.GetJoint(JointId.KneeRight);
            var kneeLeft = skeleton.Value.GetJoint(JointId.KneeLeft);
            var ankleRight = skeleton.Value.GetJoint(JointId.AnkleRight);
            var ankleLeft = skeleton.Value.GetJoint(JointId.AnkleLeft);
            var neck = skeleton.Value.GetJoint(JointId.Neck);
            var pelvis = skeleton.Value.GetJoint(JointId.Pelvis);

            result.PelvisNeck = Helpers.GetDistance(pelvis.Position, neck.Position);
            result.ShoukderElbowRight = Helpers.GetDistance(shoulderRight.Position, elbowRight.Position);
            result.ShoukderElbowLeft = Helpers.GetDistance(shoulderLeft.Position, elbowLeft.Position);
            result.ElbowWristRight = Helpers.GetDistance(elbowRight.Position, wristRight.Position);
            result.ElbowWristLeft = Helpers.GetDistance(elbowLeft.Position, wristLeft.Position);
            result.HipKneeRight = Helpers.GetDistance(hipRight.Position, kneeRight.Position);
            result.HipKneeLeft = Helpers.GetDistance(hipLeft.Position, kneeLeft.Position);
            result.KneeAnkleRight = Helpers.GetDistance(kneeRight.Position, ankleRight.Position);
            result.KneeAnkleLeft = Helpers.GetDistance(kneeLeft.Position, ankleLeft.Position);

            return result;
        }

        public static PositionsDto? GetJointsPositions(Frame currentFrame, Skeleton? previousSkeleton, double time)
        {
            if (currentFrame.NumberOfBodies != 1) return null;

            var currentSkeleton = currentFrame.GetBodySkeleton(0);

            var result = new PositionsDto();
            var jointNames = ((JointId[])Enum.GetValues(typeof(JointId))).ToList();
            jointNames.Remove(JointId.Count);
            foreach (var jointId in jointNames)
            {
                var currentJoint = currentSkeleton.GetJoint(jointId);

                double speed = 0;
                if (previousSkeleton != null)
                {
                    var previousJoint = previousSkeleton.Value.GetJoint(jointId);
                    speed = Helpers.GetSpeed(currentJoint.Position, previousJoint.Position, time);
                }

                result.Joints.Add(new JointDto()
                {
                    Name = jointId.ToString(),
                    Confidence = (short)currentJoint.ConfidenceLevel,
                    Position = currentJoint.Position,
                    Speed = speed
                });
            }

            return result;
        }

        /// <summary>
        /// Shoulder Abduction / Adduction Transversal
        /// </summary>
        /// <param name="frame"></param>
        /// <param name="side"></param>
        /// <returns></returns>
        public static double? ShoulderTransversalAA(Frame frame, Side side)
        {
            if (frame.NumberOfBodies != 1) return null;

            var skeleton = frame.GetBodySkeleton(0);
            var shoulderJoint = skeleton.GetJoint(side == Side.Left ? JointId.ShoulderLeft : JointId.ShoulderRight);
            var elbowJoint = skeleton.GetJoint(side == Side.Left ? JointId.ElbowLeft : JointId.ElbowRight);
            var torsoJoint = skeleton.GetJoint(JointId.SpineChest);

            if (elbowJoint.Position.Z - torsoJoint.Position.Z >= 0)
            {
                return 180 - Math.Abs(Math.Abs(Helpers.GetAngle2XZ(shoulderJoint.Position, elbowJoint.Position)) - 90);
            }
            else
            {
                return Math.Abs(Math.Abs(Helpers.GetAngle2XZ(shoulderJoint.Position, elbowJoint.Position)) - 90);
            }
        }

        /// <summary>
        /// Shoulder Abduction / Adduction Frontal
        /// </summary>
        /// <param name="frame"></param>
        /// <param name="side"></param>
        /// <returns></returns>
        public static double? ShoulderFrontalAA(Frame frame, Side side)
        {
            if (frame.NumberOfBodies != 1) return null;

            var skeleton = frame.GetBodySkeleton(0);
            var shoulderJoint = skeleton.GetJoint(side == Side.Left ? JointId.ShoulderLeft : JointId.ShoulderRight);

            return Helpers.GetZRotation(Matrix4x4.CreateFromQuaternion(shoulderJoint.Quaternion)) + 90;
        }

        /// <summary>
        /// Shoulder Flexion / Extension
        /// </summary>
        /// <param name="frame"></param>
        /// <param name="side"></param>
        /// <returns></returns>
        public static double? ShoulderFE(Frame frame, Side side)
        {
            if (frame.NumberOfBodies != 1) return null;

            var skeleton = frame.GetBodySkeleton(0);
            var shoulderJoint = skeleton.GetJoint(side == Side.Left ? JointId.ShoulderLeft : JointId.ShoulderRight);
            var elbowJoint = skeleton.GetJoint(side == Side.Left ? JointId.ElbowLeft : JointId.ElbowRight);

            if (elbowJoint.Position.X - shoulderJoint.Position.X >= 0)
            {
                return Math.Abs(Helpers.GetXRotation(Matrix4x4.CreateFromQuaternion(shoulderJoint.Quaternion)));
            }
            else
            {
                return 180 - Math.Abs(Helpers.GetXRotation(Matrix4x4.CreateFromQuaternion(shoulderJoint.Quaternion)));
            }
        }

        /// <summary>
        /// Elbow Flexion / Extension
        /// </summary>
        /// <param name="frame"></param>
        /// <param name="side"></param>
        /// <returns></returns>
        public static double? ElbowFE(Frame frame, Side side)
        {
            if (frame.NumberOfBodies != 1) return null;

            var skeleton = frame.GetBodySkeleton(0);
            var shoulderJoint = skeleton.GetJoint(side == Side.Left ? JointId.ShoulderLeft : JointId.ShoulderRight);
            var elbowJoint = skeleton.GetJoint(side == Side.Left ? JointId.ElbowLeft : JointId.ElbowRight);
            var wristJoint = skeleton.GetJoint(side == Side.Left ? JointId.WristLeft : JointId.WristRight);

            return 180 - Helpers.GetAngle3(elbowJoint.Position, shoulderJoint.Position, wristJoint.Position);
        }

        /// <summary>
        /// Hip Flexion / Extension
        /// </summary>
        /// <param name="frame"></param>
        /// <param name="side"></param>
        /// <returns></returns>
        public static double? HipFE(Frame frame, Side side)
        {
            if (frame.NumberOfBodies != 1) return null;

            var skeleton = frame.GetBodySkeleton(0);
            var kneeJoint = skeleton.GetJoint(side == Side.Left ? JointId.KneeLeft : JointId.KneeRight);
            var pelvisJoint = skeleton.GetJoint(JointId.Pelvis);

            return Helpers.GetAngle2YZ(kneeJoint.Position, pelvisJoint.Position) + 90;
        }

        /// <summary>
        /// Knee Flexion / Extension
        /// </summary>
        /// <param name="frame"></param>
        /// <param name="side"></param>
        /// <returns></returns>
        public static double? KneeFE(Frame frame, Side side)
        {
            if (frame.NumberOfBodies != 1) return null;

            var skeleton = frame.GetBodySkeleton(0);
            var kneeJoint = skeleton.GetJoint(side == Side.Left ? JointId.KneeLeft : JointId.KneeRight);
            var hipJoint = skeleton.GetJoint(side == Side.Left ? JointId.HipLeft : JointId.HipRight);
            var ankleJoint = skeleton.GetJoint(side == Side.Left ? JointId.AnkleLeft : JointId.AnkleRight);

            return 180 - Helpers.GetAngle3(kneeJoint.Position, hipJoint.Position, ankleJoint.Position);
        }

        /// <summary>
        /// Hip Abduction / Adduction Frontal
        /// </summary>
        /// <param name="frame"></param>
        /// <param name="side"></param>
        /// <returns></returns>
        public static double? HipFrontalAA(Frame frame, Side side)
        {
            if (frame.NumberOfBodies != 1) return null;

            var skeleton = frame.GetBodySkeleton(0);
            var hipJoint = skeleton.GetJoint(side == Side.Left ? JointId.HipLeft : JointId.HipRight);

            return Helpers.GetYRotation(Matrix4x4.CreateFromQuaternion(hipJoint.Quaternion)) + 90;
        }

        /// <summary>
        /// Hip Abduction / Adduction Transversal
        /// </summary>
        /// <param name="frame"></param>
        /// <param name="side"></param>
        /// <returns></returns>
        public static double? HipTransversalAA(Frame frame, Side side)
        {
            if (frame.NumberOfBodies != 1) return null;

            var skeleton = frame.GetBodySkeleton(0);
            var kneeJoint = skeleton.GetJoint(side == Side.Left ? JointId.KneeLeft : JointId.KneeRight);
            var hipJoint = skeleton.GetJoint(side == Side.Left ? JointId.HipLeft : JointId.HipRight);

            return Math.Abs(Math.Abs(Helpers.GetAngle2XZ(hipJoint.Position, kneeJoint.Position)) - 90);
        }

        /// <summary>
        /// Knee Abduction / Adduction
        /// </summary>
        /// <param name="frame"></param>
        /// <param name="side"></param>
        /// <returns></returns>
        public static double? KneeTransversalAA(Frame frame, Side side)
        {
            if (frame.NumberOfBodies != 1) return null;

            var skeleton = frame.GetBodySkeleton(0);
            var kneeJoint = skeleton.GetJoint(side == Side.Left ? JointId.KneeLeft : JointId.KneeRight);
            var hipJoint = skeleton.GetJoint(side == Side.Left ? JointId.HipLeft : JointId.HipRight);

            return Helpers.GetXRotationsDiff(Matrix4x4.CreateFromQuaternion(hipJoint.Quaternion), Matrix4x4.CreateFromQuaternion(kneeJoint.Quaternion));
        }

        /// <summary>
        /// Spine Rotation
        /// </summary>
        /// <param name="frame"></param>
        /// <param name="side"></param>
        /// <returns></returns>
        public static double? SpineRotation(Frame frame)
        {
            if (frame.NumberOfBodies != 1) return null;

            var skeleton = frame.GetBodySkeleton(0);
            var pelvisJoint = skeleton.GetJoint(JointId.Pelvis);
            var torsoJoint = skeleton.GetJoint(JointId.SpineChest);

            return Helpers.GetYRotationsDiff(Matrix4x4.CreateFromQuaternion(torsoJoint.Quaternion), Matrix4x4.CreateFromQuaternion(pelvisJoint.Quaternion));
        }

        /// <summary>
        /// Thoracic Flexion
        /// </summary>
        /// <param name="frame"></param>
        /// <returns></returns>
        public static double? ThoracicFlexion(Frame frame)
        {
            if (frame.NumberOfBodies != 1) return null;

            var skeleton = frame.GetBodySkeleton(0);
            var neckJoint = skeleton.GetJoint(JointId.Neck);
            var torsoJoint = skeleton.GetJoint(JointId.SpineChest);

            return (Helpers.GetAngle2YZ(neckJoint.Position, torsoJoint.Position) - 90) * -1;
        }

        /// <summary>
        /// Spine Lateroflexion
        /// </summary>
        /// <param name="frame"></param>
        /// <returns></returns>
        public static double? SpineLateroflexion(Frame frame)
        {
            if (frame.NumberOfBodies != 1) return null;

            var skeleton = frame.GetBodySkeleton(0);
            var torsoJoint = skeleton.GetJoint(JointId.SpineChest);

            return Helpers.GetYRotation(Matrix4x4.CreateFromQuaternion(torsoJoint.Quaternion)) + 90;
        }

        /// <summary>
        /// Cervical Flexion
        /// </summary>
        /// <param name="frame"></param>
        /// <returns></returns>
        public static double? CervicalFlexion(Frame frame)
        {
            if (frame.NumberOfBodies != 1) return null;

            var skeleton = frame.GetBodySkeleton(0);
            var neckJoint = skeleton.GetJoint(JointId.Neck);
            var headJoint = skeleton.GetJoint(JointId.Head);

            return (Helpers.GetAngle2YZ(headJoint.Position, neckJoint.Position) - 90) * -1;
        }

        /// <summary>
        /// Lumbar Flexion
        /// </summary>
        /// <param name="frame"></param>
        /// <returns></returns>
        public static double? LumbarFlexion(Frame frame)
        {
            if (frame.NumberOfBodies != 1) return null;

            var skeleton = frame.GetBodySkeleton(0);
            var neckJoint = skeleton.GetJoint(JointId.Neck);
            var pelvisJoint = skeleton.GetJoint(JointId.Pelvis);

            return (Helpers.GetAngle2YZ(neckJoint.Position, pelvisJoint.Position) - 90) * -1;
        }
    }


    public enum Side
    {
        Left,
        Right
    }
}
