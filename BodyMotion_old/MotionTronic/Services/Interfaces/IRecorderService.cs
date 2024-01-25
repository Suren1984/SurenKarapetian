using BodyMotionDto;

namespace MotionTronic.Services.Interfaces
{
    /// <summary>
    /// Service providing interactions with a recording device
    /// </summary>
    public interface IRecorderService
    {
        Task StartRecorder(string patientId, short fps, string runId, CancellationToken cancellationToken);
        void StopRecorder(string runId, CancellationTokenSource cancellationToken);
    }
}
