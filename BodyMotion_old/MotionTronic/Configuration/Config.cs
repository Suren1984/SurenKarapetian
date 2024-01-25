namespace MotionTronic.Configuration
{
    public class Config
    {
        public static HttpListenerSettings HttpListener { get; private set; }
        public static DataProviderSettings DataProvider { get; private set; }

        public static void InitConfig(IConfiguration configuration)
        {
            HttpListener = new HttpListenerSettings(configuration.GetSection("HttpListener"));
            DataProvider = new DataProviderSettings(configuration.GetSection("DataProvider"));
        }

        public class HttpListenerSettings
        {
            public string[] Prefixes { get; set; }

            public HttpListenerSettings(IConfigurationSection configurationSection)
            {
                Prefixes = configurationSection["Prefixes"].Split(",");
            }
        }

        public class DataProviderSettings
        {
            public string FilePath { get; set; }

            public DataProviderSettings(IConfigurationSection configurationSection)
            {
                FilePath = configurationSection["FilePath"];
            }
        }
    }
}
