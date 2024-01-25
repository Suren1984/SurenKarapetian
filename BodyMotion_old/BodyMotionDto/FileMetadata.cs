using System;

namespace BodyMotionDto
{
    public class FileMetadata
    {
        /// <summary>
        /// File name with extension
        /// </summary>
        public string Name { get; set; } = "";

        /// <summary>
        /// Size in Bytes
        /// </summary>
        public long Size { get; set; } = 0;

        /// <summary>
        /// Local file creation time
        /// </summary>
        public DateTime CreationTime { get; set; } = new DateTime();
    }
}
