using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BodyMotionDto
{
    public class CommandDto
    {
        public string Name { get; set; }
        public Dictionary<string, object> Properties { get; set; }
    }
}
