using BodyMotionDto;
using BodyMotionDto.Joints;
using MotionTronic.Configuration;
using MotionTronic.Services.Interfaces;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

namespace MotionTronic.Services
{
    /// <summary>
    /// Service providing saving/loading possibilities for records on a local storage device
    /// </summary>
    public class LocalDataProviderService : IDataProviderService
    {
        private readonly string CalculationsFolderName = "Calculations";

        private readonly ILogger<LocalDataProviderService> _logger;
        private readonly ICalculationsService _calculationsService;

        public LocalDataProviderService(ILogger<LocalDataProviderService> logger, ICalculationsService calculationsService)
        {
            _logger = logger;
            _calculationsService = calculationsService;
        }

        public SegmentDto? GetLatestCalculations(string runId, bool withImage, bool withPositions, bool withDistances)
        {
            _logger.LogInformation("{runId} | Message: Start GetLatestCalculations", runId);

            SegmentDto result = new();

            if (SessionState.Segments != null && SessionState.Segments.Count > 0)
            {
                result = MapSegment(SessionState.Segments.Last(), withPositions, withDistances);

                if (withImage)
                {
                    result.DepthImage = Convert.ToBase64String(GetLatestDepthImage(runId));
                }
            }

            _logger.LogInformation("{runId} | Message: End GetLatestCalculations", runId);
            return result;
        }

        public SegmentDto? GetLatestCalculationsMock(string runId, Stopwatch stopwatch, long sequence, bool withImage, bool withPositions, bool withDistances)
        {
            _logger.LogInformation("{runId} | Message: Start GetLatestCalculationsTest", runId);

            SegmentDto result = new(DateTime.Now.Ticks, sequence, stopwatch.ElapsedMilliseconds);

            result.Angles = null; // _calculationsService.GetAnglesMock(stopwatch, sequence);

            if (withImage)
            {
                result.DepthImage = Convert.ToBase64String(GetLatestDepthImageMock(runId));
            }

            if (withPositions)
            {
                result.Positions = null; // _calculationsService.GetPositionsMock();
            }

            if (withDistances)
            {
                result.Distances = GetLatestDistancesMock(runId);
            }

            _logger.LogInformation("{runId} | Message: End GetLatestCalculationsTest", runId);
            return result;
        }

        private byte[] GetLatestDepthImageMock(string runId)
        {
            _logger.LogInformation("{runId} | Message: Start GetLatestCalculationsTest", runId);

            var result = File.ReadAllBytes("DepthImageTest.jpg");

            _logger.LogInformation("{runId} | Message: End GetLatestCalculationsTest", runId);
            return result;
        }

        public DistancesDto GetLatestDistancesMock(string runId)
        {
            _logger.LogInformation("{runId} | Message: Start GetLatestDistancesTest", runId);

            DistancesDto result = null; //_calculationsService.GetDistancesMock();

            _logger.LogInformation("{runId} | Message: End GetLatestDistancesTest", runId);
            return result;
        }

        public byte[] GetLatestDepthImage(string runId)
        {
            _logger.LogInformation("{runId} | Message: Start GetLatestDepthImage", runId);

            byte[] result = new byte[0];
            if (SessionState.DepthImagePixels != null)
            {
                byte[] pixelsBytes = new byte[SessionState.DepthImagePixels.Length * 2];
                Buffer.BlockCopy(SessionState.DepthImagePixels, 0, pixelsBytes, 0, SessionState.DepthImagePixels.Length * 2);
                var bitmap = new Bitmap(SessionState.DepthImageWidth, SessionState.DepthImageHeight, SessionState.DepthImageStride, PixelFormat.Format16bppRgb565, Marshal.UnsafeAddrOfPinnedArrayElement(pixelsBytes, 0));

                using (MemoryStream bitmapStream = new MemoryStream())
                {
                    bitmap.Save(bitmapStream, ImageFormat.Jpeg);
                    result = bitmapStream.ToArray();
                }
            }

            _logger.LogInformation("{runId} | Message: End GetLatestDepthImage", runId);
            return result;
        }

        public List<SegmentDto>? GetSessionCalculations(string patientId, string runId, string fileName, bool withPositions, bool withDistances)
        {
            _logger.LogInformation("{runId} | Message: Start GetSessionCalculations", runId);

            var fileBytes = Array.Empty<byte>();
            try
            {
                fileBytes = File.ReadAllBytes($"{Config.DataProvider.FilePath}/{CalculationsFolderName}/{patientId}/{fileName}");
            }
            catch (FileNotFoundException)
            {
                return new List<SegmentDto>();
            }

            var decompressedData = Helper.Unzip(fileBytes);

            var deserializedData = JsonConvert.DeserializeObject<List<SegmentDto>>(decompressedData);

            List<SegmentDto> newSegments = new();
            foreach (var originalSegment in deserializedData)
            {
                newSegments.Add(MapSegment(originalSegment, withPositions, withDistances));
            }

            _logger.LogInformation("{runId} | Message: End GetSessionCalculations", runId);
            return newSegments;
        }

        public byte[] DownloadSessionCalculationsBinary(string patientId, string runId, string fileName, bool withPositions, bool withDistances)
        {
            _logger.LogInformation("{runId} | Message: Start GetSessionCalculations", runId);

            var fileBytes = Array.Empty<byte>();
            try
            {
                fileBytes = File.ReadAllBytes($"{Config.DataProvider.FilePath}/{CalculationsFolderName}/{patientId}/{fileName}");
            }
            catch (FileNotFoundException)
            {
                return Array.Empty<byte>();
            }

            var decompressedData = Helper.Unzip(fileBytes);
            var deserializedData = JsonConvert.DeserializeObject<List<SegmentDto>>(decompressedData);

            List<SegmentDto> newSegments = new();
            foreach (var originalSegment in deserializedData)
            {
                newSegments.Add(MapSegment(originalSegment, withPositions, withDistances));
            }

            var serializedData = JsonConvert.SerializeObject(newSegments);
            var compressedData = Helper.Zip(serializedData);

            _logger.LogInformation("{runId} | Message: End GetSessionCalculations", runId);
            return compressedData;
        }

        private SegmentDto MapSegment(SegmentDto original, bool withPositions, bool withDistances)
        {
            SegmentDto result = new(original.TimeStamp, original.Sequence, original.Duration);

            result.Angles = original.Angles;

            result.Positions = withPositions ? original.Positions : null;
            result.Distances = withDistances ? original.Distances : null;

            return result;
        }

        public bool SaveSessionCalculations(string patientId, string runId)
        {
            _logger.LogInformation("{runId} | Message: Start SaveSessionCalculations", runId);

            SaveToDisk($"{Config.DataProvider.FilePath}/{CalculationsFolderName}/{patientId}", patientId, JsonConvert.SerializeObject(SessionState.Segments));

            _logger.LogInformation("{runId} | Message: End SaveSessionCalculations", runId);
            return true;
        }

        private bool SaveToDisk(string directoryPath, string patientId, string serializedData) 
        {
            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }
            var compressedData = Helper.Zip(serializedData);

            File.WriteAllBytes($"{directoryPath}/{patientId}_{DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss")}.dat", compressedData);
            File.WriteAllText($"{directoryPath}/{patientId}_{DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss")}.json", serializedData);

            return true;
        }

        public List<FileMetadata> GetPatientCalculationsList(string patientId, string runId, int pageNumber, int recordsPerPage)
        {
            List<FileMetadata> result = new();

            var patientDir = $"{Config.DataProvider.FilePath}/{CalculationsFolderName}/{patientId}";
            if (Directory.Exists(patientDir))
            {
                var fullFileNames = Directory.GetFiles(patientDir);

                foreach ( var fullFileName in fullFileNames) 
                {
                    FileMetadata fileMetadata = new();

                    var fileInfo = new FileInfo(fullFileName);
                    fileMetadata.Name = fileInfo.Name;
                    fileMetadata.CreationTime = fileInfo.CreationTime;
                    fileMetadata.Size = fileInfo.Length;

                    result.Add(fileMetadata);
                }
            }
            
            return result
                .OrderByDescending(r => r.CreationTime)
                .Skip((pageNumber - 1) * recordsPerPage)
                .Take(recordsPerPage)
                .ToList();
        }
    }
}
