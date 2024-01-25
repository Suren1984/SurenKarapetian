using BodyMotionDto;
using BodyMotionDto.Joints;
using Microsoft.Azure.Kinect.BodyTracking;
using Microsoft.Azure.Kinect.Sensor;
using MotionTronic.Services.Interfaces;
using System;

namespace MotionTronic.Services
{
    /// <summary>
    /// Service providing interactions with Azure Kinect device
    /// </summary>
    public class KinectRecorderService : IRecorderService
    {
        private readonly ILogger<KinectRecorderService> _logger;
        private readonly ICalculationsService _calculationsService;
        private readonly IDataProviderService _dataProviderService;

        public KinectRecorderService(ILogger<KinectRecorderService> logger, ICalculationsService calculationsService, IDataProviderService dataProviderService)
        {
            _logger = logger;
            _calculationsService = calculationsService;
            _dataProviderService = dataProviderService;
        }

        public async Task StartRecorder(string patientId, short fps, string runId, CancellationToken cancellationToken)
        {
            _logger.LogInformation("{runId} | Message: Starting recorder", runId);

            SessionState.Clean();

            try
            {
                // Open device.
                using (Device device = Device.Open())
                {
                    device.StartCameras(new DeviceConfiguration()
                    {
                        CameraFPS = GetKinectFps(fps),
                        ColorResolution = ColorResolution.Off,
                        DepthMode = DepthMode.NFOV_Unbinned,
                        WiredSyncMode = WiredSyncMode.Standalone,
                    });

                    var deviceCalibration = device.GetCalibration();

                    var excelRecords = new List<List<int?>>();

                    for (int i = 0; i < 24; i++)
                    {
                        excelRecords.Add(new List<int?>());
                    }

                    var excelRecordsTimeStamp = new List<string>();

                    using (Tracker tracker = Tracker.Create(deviceCalibration, new TrackerConfiguration() { ProcessingMode = TrackerProcessingMode.Gpu, SensorOrientation = SensorOrientation.Default }))
                    {
                        SessionState.Stopwatch = new System.Diagnostics.Stopwatch();
                        SessionState.Stopwatch.Start();
                        long sequenceCounter = 0;
                        Skeleton? previousSkeleton = null;
                        double frameTime = 1000 / fps;

                        while (!cancellationToken.IsCancellationRequested)
                        {
                            using (Capture sensorCapture = device.GetCapture())
                            {
                                // Queue latest frame from the sensor.
                                tracker.EnqueueCapture(sensorCapture);
                            }

                            // Try getting latest tracker frame.
                            using (Frame frame = tracker.PopResult(TimeSpan.Zero, throwOnTimeout: false))
                            {
                                if (frame != null)
                                {
                                    // Save this frame for visualization in Renderer.

                                    // One can access frame data here and extract e.g. tracked bodies from it for the needed purpose.
                                    // Instead, for simplicity, we transfer the frame object to the rendering background thread.
                                    // This example shows that frame popped from tracker should be disposed. Since here it is used
                                    // in a different thread, we use Reference method to prolong the lifetime of the frame object.
                                    // For reference on how to read frame data, please take a look at Renderer.NativeWindow_Render().
                                    var frameReference = frame.Reference();

                                    SessionState.DepthImagePixels = frameReference.Capture.Depth.GetPixels<ushort>().ToArray();
                                    SessionState.DepthImageWidth = frameReference.Capture.Depth.WidthPixels;
                                    SessionState.DepthImageHeight = frameReference.Capture.Depth.HeightPixels;
                                    SessionState.DepthImageStride = frameReference.Capture.Depth.StrideBytes;

                                    sequenceCounter++;
                                    SegmentDto segment = new(DateTime.Now.Ticks, sequenceCounter, SessionState.Stopwatch.ElapsedMilliseconds);
                                    segment.Angles = _calculationsService.GetAngles(frameReference);
                                    segment.Positions = _calculationsService.GetPositions(frameReference, previousSkeleton, frameTime);
                                    segment.Distances = _calculationsService.GetDistances();

                                    SessionState.Segments.Add(segment);

                                    if (frameReference.NumberOfBodies == 1)
                                    {
                                        previousSkeleton = frameReference.GetBodySkeleton(0);
                                        SessionState.KinectSkeleton = previousSkeleton;
                                    }

                                    if (sequenceCounter % fps == 0)
                                    {
                                        _logger.LogInformation($"{runId} | Still recording, detected bodies: {frameReference.NumberOfBodies}");
                                    }
                                }
                            }
                        }
                    }

                    SessionState.Stopwatch.Stop();
                    _dataProviderService.SaveSessionCalculations(patientId, runId);
                }
            }
            catch(Exception exc)
            {
                _logger.LogError($"{runId} | No camera detected. Error: {exc.Message}");
            }

            _logger.LogInformation("{runId} | Recorder has been stopped", runId);
            return;
        }

        private FPS GetKinectFps(int fps)
            => fps switch
        {
            5 => FPS.FPS5,
            15 => FPS.FPS15,
            30 => FPS.FPS30,
            _ => FPS.FPS30,
        };

        public void StopRecorder(string runId, CancellationTokenSource cancellationTokenSource)
        {
            cancellationTokenSource.Cancel();
        }
    }
}
