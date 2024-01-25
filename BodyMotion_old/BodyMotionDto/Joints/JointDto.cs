using System.Numerics;

namespace BodyMotionDto.Joints
{
    public class JointDto
    {
        public string Name { get; set; }
        /// <summary>
        /// Speed in m/s
        /// </summary>
        public double Speed { get; set; }
        /// <summary>
        /// Confidence in joint position
        /// </summary>
        public short Confidence { get; set; }
        public Vector3 Position { get; set; }
        //public Quaternion Quaternion { get; set; }
    }
}
