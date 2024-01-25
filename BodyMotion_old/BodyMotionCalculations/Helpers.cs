using System;
using System.Linq;
using System.Numerics;

namespace BodyMotionCalculations
{
    internal class Helpers
    {
        /// <summary>
        /// Positions: 0 3 6
        /// </summary>
        /// <param name="matrix"></param>
        /// <returns></returns>
        internal static double GetXRotation(Matrix4x4 matrix)
        {
            return Math.Round(Math.Atan2(matrix.M32, matrix.M33) * (180 / Math.PI));
        }

        /// <summary>
        /// Positions: 1 4 7
        /// </summary>
        /// <param name="matrix"></param>
        /// <returns></returns>
        internal static double GetYRotation(Matrix4x4 matrix)
        {
            var sy = Math.Sqrt(matrix.M11 * matrix.M11 + matrix.M21 * matrix.M21);
            return Math.Round(Math.Atan2(-matrix.M31, sy) * (180 / Math.PI));
        }

        /// <summary>
        /// Positions: 2 5 8
        /// </summary>
        /// <param name="matrix"></param>
        /// <returns></returns>
        internal static double GetZRotation(Matrix4x4 matrix)
        {
            return Math.Round(Math.Atan2(matrix.M21, matrix.M11) * (180 / Math.PI));
        }

        internal static double GetCMDifference(double a, double b)
        {
            return Math.Round((a - b) / 10, 1);
        }

        // TODO: this function is not written correctly in php
        internal static double GetAngle3(Vector3 v1, Vector3 v2, Vector3 v3)
        {
            var a = new Vector3(v1.X, v1.Y, v1.Z);
            var b = new Vector3(v2.X, v2.Y, v2.Z);
            var c = new Vector3(v3.X, v3.Y, v3.Z);

            var targetToParentVector = CalculateVector(a, b);
            var targetToChildVector = CalculateVector(a, c);

            var dot = Dot(targetToParentVector, targetToChildVector);
            var maga = Math.Sqrt(
                Math.Pow(targetToParentVector.X, 2)
                + Math.Pow(targetToParentVector.Y, 2)
                + Math.Pow(targetToParentVector.Z, 2)
            );
            var magb = Math.Sqrt(
                Math.Pow(targetToChildVector.X, 2)
                + Math.Pow(targetToChildVector.Y, 2)
                + Math.Pow(targetToChildVector.Z, 2)
            );

            return Math.Round(Math.Acos(dot / (maga * magb)) * (180 / Math.PI));
        }

        internal static double Dist(Vector3 v1, Vector3 v2)
        {
            return Math.Sqrt(
                Math.Pow(v1.X - v2.X, 2)
                + Math.Pow(v1.Y - v2.Y, 2)
                + Math.Pow(v1.Z - v2.Z, 2)
            );
        }

        internal static Vector3 CalculateVector(Vector3 v1, Vector3 v2)
        {
            return new Vector3(
                v1.X - v2.X,
                v1.Y - v2.Y,
                v1.Z - v2.Z
            );
        }

        internal static double GetAngle3XY(Vector3 v1, Vector3 v2, Vector3 v3)
        {
            var v = Math.Atan2(v3.Y - v1.Y, v3.X - v1.X) - Math.Atan2(v2.Y - v1.Y, v2.X - v1.X);

            return Math.Round(v * (180 / Math.PI));
        }

        internal static double GetAngle3YZ(Vector3 v1, Vector3 v2, Vector3 v3)
        {
            var v = Math.Atan2(v3.Y - v1.Y, v3.Z - v1.Z) - Math.Atan2(v2.Y - v1.Y, v2.Z - v1.Z);

            return Math.Round(v * (180 / Math.PI));
        }

        internal static double GetAngle3XZ(Vector3 v1, Vector3 v2, Vector3 v3)
        {
            var v = Math.Atan2(v3.Z - v1.Z, v3.X - v1.X) - Math.Atan2(v2.Z - v1.Z, v2.X - v1.X);

            return Math.Round(v * (180 / Math.PI));
        }

        internal static double Norm(Vector3 v)
        {
            return Math.Sqrt(Vector3.Dot(v, v));
        }

        internal static double Dot(Vector3 v1, Vector3 v2)
        {
            return Vector3.Dot(v1, v2);
        }

        internal static double GetXRotationsDiff(Matrix4x4 matrix1, Matrix4x4 matrix2)
        {
            return GetXRotation(matrix1) - GetXRotation(matrix2);
        }

        internal static double GetYRotationsDiff(Matrix4x4 matrix1, Matrix4x4 matrix2)
        {
            return GetYRotation(matrix1) - GetYRotation(matrix2);
        }

        internal static double GetZRotationsDiff(Matrix4x4 matrix1, Matrix4x4 matrix2)
        {
            return GetZRotation(matrix1) - GetZRotation(matrix2);
        }

        internal static double GetAngle2XY(Vector3 a, Vector3 b)
        {
            var xDiff = b.X - a.X;
            var yDiff = b.Y - a.Y;

            return Math.Round(Math.Atan2(yDiff, xDiff) * 180.0 / Math.PI);
        }

        internal static double GetAngle2XZ(Vector3 a, Vector3 b)
        {
            var xDiff = b.X - a.X;
            var zDiff = b.Z - a.Z;

            return Math.Round(Math.Atan2(zDiff, xDiff) * 180.0 / Math.PI);
        }

        internal static double GetAngle2YZ(Vector3 a, Vector3 b)
        {
            var zDiff = b.Z - a.Z;
            var yDiff = b.Y - a.Y;

            return Math.Round(Math.Atan2(yDiff, zDiff) * 180.0 / Math.PI);
        }

        internal static double Avg(double[] a)
        {
            return Math.Round(a.Sum() / a.Length, 1);
        }

        // TODO: this function is not written correctly in php
        internal static double Med(double[] arr)
        {
            double num = arr.Length;
            var middleVal = (int)Math.Round(num / 2);

            if (num % 2 != 0)
            {
                return arr[middleVal];
            }
            else
            {
                var lowMid = arr[middleVal];
                var highMid = arr[middleVal + 1];
                return Math.Round((lowMid + highMid) / 2);
            }
        }

        internal static string GetShare(double[] arr, int from, int to)
        {
            double count = 0;
            foreach (var val in arr)
            {
                if (Math.Abs(Math.Round(val, 0)) >= from && Math.Abs(Math.Round(val, 0)) <= to)
                {
                    count++;
                }
            }

            var all = arr.Length;
            var countSeconds = Math.Round(count * 250 / 1000, 1);

            if (count > 0)
            {
                return Math.Round(count * 100 / all, 0) + "% - " + countSeconds + "s";
            }

            return "";
        }

        internal static string RangeOfMotion(double[] arr)
        {
            return Math.Round(Math.Abs(arr.Min())) + "° - " + Math.Round(Math.Abs(arr.Max())) + "°";
        }
    }
}
