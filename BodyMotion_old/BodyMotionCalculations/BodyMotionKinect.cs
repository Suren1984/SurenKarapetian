using Microsoft.Azure.Kinect.BodyTracking;
using System;
using System.Numerics;

namespace BodyMotionCalculations
{
    public static class BodyMotionKinect
    {
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
            var shoulderJoint = skeleton.GetJoint(side == Side.Left ? (int)JointId.ShoulderLeft : (int)JointId.ShoulderRight);
            var elbowJoint = skeleton.GetJoint(side == Side.Left ? (int)JointId.ElbowLeft : (int)JointId.ElbowRight);
            var torsoJoint = skeleton.GetJoint((int)JointId.SpineChest);

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
            var shoulderJoint = skeleton.GetJoint(side == Side.Left ? (int)JointId.ShoulderLeft : (int)JointId.ShoulderRight);

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
            var shoulderJoint = skeleton.GetJoint(side == Side.Left ? (int)JointId.ShoulderLeft : (int)JointId.ShoulderRight);
            var elbowJoint = skeleton.GetJoint(side == Side.Left ? (int)JointId.ElbowLeft : (int)JointId.ElbowRight);

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
            var shoulderJoint = skeleton.GetJoint(side == Side.Left ? (int)JointId.ShoulderLeft : (int)JointId.ShoulderRight);
            var elbowJoint = skeleton.GetJoint(side == Side.Left ? (int)JointId.ElbowLeft : (int)JointId.ElbowRight);
            var wristJoint = skeleton.GetJoint(side == Side.Left ? (int)JointId.WristLeft : (int)JointId.WristRight);

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
            var kneeJoint = skeleton.GetJoint(side == Side.Left ? (int)JointId.KneeLeft : (int)JointId.KneeRight);
            var waistJoint = skeleton.GetJoint((int)JointId.Pelvis);

            return Helpers.GetAngle2YZ(kneeJoint.Position, waistJoint.Position) + 90;
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
            var kneeJoint = skeleton.GetJoint(side == Side.Left ? (int)JointId.KneeLeft : (int)JointId.KneeRight);
            var hipJoint = skeleton.GetJoint(side == Side.Left ? (int)JointId.HipLeft : (int)JointId.HipRight);
            var ankleJoint = skeleton.GetJoint(side == Side.Left ? (int)JointId.AnkleLeft : (int)JointId.AnkleRight);

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
            var hipJoint = skeleton.GetJoint(side == Side.Left ? (int)JointId.HipLeft : (int)JointId.HipRight);

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
            var kneeJoint = skeleton.GetJoint(side == Side.Left ? (int)JointId.KneeLeft : (int)JointId.KneeRight);
            var hipJoint = skeleton.GetJoint(side == Side.Left ? (int)JointId.HipLeft : (int)JointId.HipRight);

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
            var kneeJoint = skeleton.GetJoint(side == Side.Left ? (int)JointId.KneeLeft : (int)JointId.KneeRight);
            var hipJoint = skeleton.GetJoint(side == Side.Left ? (int)JointId.HipLeft : (int)JointId.HipRight);

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
            var waistJoint = skeleton.GetJoint((int)JointId.Pelvis);
            var torsoJoint = skeleton.GetJoint((int)JointId.SpineChest);

            return Helpers.GetYRotationsDiff(Matrix4x4.CreateFromQuaternion(torsoJoint.Quaternion), Matrix4x4.CreateFromQuaternion(waistJoint.Quaternion));
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
            var neckJoint = skeleton.GetJoint((int)JointId.Neck);
            var torsoJoint = skeleton.GetJoint((int)JointId.SpineChest);

            return Helpers.GetAngle2YZ(neckJoint.Position, torsoJoint.Position) - 90;
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
            var torsoJoint = skeleton.GetJoint((int)JointId.SpineChest);

            return Helpers.GetZRotation(Matrix4x4.CreateFromQuaternion(torsoJoint.Quaternion)) + 90;
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
            var neckJoint = skeleton.GetJoint((int)JointId.Neck);
            var headJoint = skeleton.GetJoint((int)JointId.Head);

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
            var neckJoint = skeleton.GetJoint((int)JointId.Neck);
            var waistJoint = skeleton.GetJoint((int)JointId.Pelvis);

            return Helpers.GetAngle2YZ(neckJoint.Position, waistJoint.Position) - 90;
        }
    }

    public enum Side
    {
        Left,
        Right
    }
}
