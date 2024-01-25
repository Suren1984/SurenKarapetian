using BodyMotionDto;
using BodyMotionDto.Joints;
using System.Diagnostics;

namespace MotionTronic.Services.Interfaces
{
    /// <summary>
    /// Service providing saving/loading possibilities for records
    /// </summary>
    public interface IDataProviderService
    {
        SegmentDto? GetLatestCalculations(string runId, bool withImage, bool withPositions, bool withDistances);
        byte[] GetLatestDepthImage(string runId);
        List<SegmentDto>? GetSessionCalculations(string patientId, string runId, string fileName, bool withPositions, bool withDistances);
        byte[] DownloadSessionCalculationsBinary(string patientId,string runId, string fileName, bool withPositions, bool withDistances);
        bool SaveSessionCalculations(string patientId, string runId);

        SegmentDto? GetLatestCalculationsMock(string runId, Stopwatch stopwatch, long sequence, bool withImage, bool withPositions, bool withDistances);
        List<FileMetadata> GetPatientCalculationsList(string patientId, string runId, int pageNumber, int recordsPerPage);
    }
}
