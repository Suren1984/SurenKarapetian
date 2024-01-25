using BodyMotionDto;
using MotionTronic.Configuration;
using MotionTronic.Services.Interfaces;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Net;
using System.Net.Mime;
using System.Text;

namespace MotionTronic
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly IRecorderService _recorderService;
        private readonly IDataProviderService _dataProviderService;

        HttpListener _listener = new HttpListener();
        CancellationTokenSource _cancellationTokenSource;

        private bool _isRecorderStarted = false;

        // For testing
        private Stopwatch _generalStopwatch = new Stopwatch();
        private long _sequence = 0;

        public Worker(ILogger<Worker> logger, IRecorderService recorderService, IDataProviderService dataProviderService)
        {
            _logger = logger;
            _recorderService = recorderService;
            _dataProviderService = dataProviderService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Start Worker Service");
            foreach (var prefix in Config.HttpListener.Prefixes)
            {
                _listener.Prefixes.Add(prefix);
            }
            _listener.Start();
            _generalStopwatch.Start();

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    //GetContextAsync() returns when a new request comes in
                    var context = await _listener.GetContextAsync();
                    lock (_listener)
                    {
                        var runId = context.Request.QueryString["RunId"] ?? Guid.NewGuid().ToString();
                        ProcessRequest(context, runId);
                    }
                }
                catch (Exception e)
                {
                    string displayMessage;
                    if (e is HttpListenerException)
                    {
                        displayMessage = "Http Listener has failed";
                    }
                    else
                    {
                        displayMessage = "Unexpected error has ocurred";
                    }

                    _logger.LogError($"{displayMessage}:\r\n{e.Message}", e);
                }
            }

            _generalStopwatch.Stop();
            _logger.LogInformation("End Worker Service");
        }

        private void ProcessRequest(HttpListenerContext context, string runId)
        {
            _logger.LogInformation("{runId} | Start ProcessRequest", runId);
            using (var response = context.Response)
            {
                try
                {
                    var handled = false;
                    var isSuccess = true;
                    switch (context.Request.Url.AbsolutePath.ToLower())
                    {
                        //This is where we do different things depending on the URL
                        case "/command":
                            CommandRequest(context, response, runId, ref handled);                            
                            break;
                        case "/getlatestcalculations":
                            GetLatestCalculationsRequest(context, response, runId, ref handled);                                                        
                            break;
                        case "/getlatestcalculationstest":
                            GetLatestCalculationsTestRequest(context, response, runId, ref handled);
                            break;
                        case "/getsessioncalculations":
                            GetSessionCalculationsRequest(context, response, runId, ref handled);                            
                            break;
                        case "/downloadcalculationsbinary":
                            DownloadSessionCalculationsBinaryRequest(context, response, runId, ref handled);
                            break;
                        case "/getpatientcalculationslist":
                            GetPatientCalculationsListRequest(context, response, runId, ref handled);
                            break;
                        case "/getlatestdepthimage":
                            GetLatestDepthImageRequest(context, response, runId, ref handled);
                            break;
                    }

                    if (!handled)
                    {
                        var displayMessage = "Endpoint not found";

                        _logger.LogInformation(displayMessage);

                        WriteToResponseStream(response, displayMessage, MediaTypeNames.Text.Plain, HttpStatusCode.NotFound);
                    }
                }
                catch (Exception e)
                {
                    var displayMessage = "Error while processing request";

                    _logger.LogError(e.Message, e);

                    WriteToResponseStream(response, displayMessage, MediaTypeNames.Application.Json, HttpStatusCode.InternalServerError);
                }
            }

            _logger.LogInformation("{runId} | End ProcessRequest", runId);
        }

        private void GetPatientCalculationsListRequest(HttpListenerContext context, HttpListenerResponse response, string runId, ref bool handled)
        {
            switch (context.Request.HttpMethod)
            {
                case "GET":
                    handled = true;
                    var inputPatientId = context.Request.QueryString["PatientId"];

                    var pageNumber = Convert.ToInt32(context.Request.QueryString["PageNumber"]);
                    var recordsPerPage = Convert.ToInt32(context.Request.QueryString["RecordsPerPage"]);

                    if (inputPatientId != null)
                    {
                        var result = _dataProviderService.GetPatientCalculationsList(inputPatientId, runId, pageNumber, recordsPerPage);

                        WriteToResponseStream(response, result, MediaTypeNames.Application.Json, HttpStatusCode.OK);
                    }
                    else
                    {
                        WriteToResponseStream(response, null, null, HttpStatusCode.BadRequest);
                    }

                    break;
            }
        }

        private void DownloadSessionCalculationsBinaryRequest(HttpListenerContext context, HttpListenerResponse response, string runId, ref bool handled)
        {
            switch (context.Request.HttpMethod)
            {
                case "GET":
                    handled = true;
                    var fileName = context.Request.QueryString["FileName"];
                    var inputPatientId = context.Request.QueryString["PatientId"];

                    var withPositions = Convert.ToBoolean(context.Request.QueryString["WithPositions"]);
                    var withDistances = Convert.ToBoolean(context.Request.QueryString["WithDistances"]);

                    if (fileName != null && inputPatientId != null)
                    {
                        var result = _dataProviderService.DownloadSessionCalculationsBinary(inputPatientId, runId, fileName, withPositions, withDistances);

                        if (result.Length > 0)
                        {
                            WriteToResponseStream(response, result, MediaTypeNames.Application.Octet, HttpStatusCode.OK, false, fileName);
                        }
                        else
                        {
                            var displayMessage = "Requested file was not found";
                            _logger.LogInformation(displayMessage);

                            WriteToResponseStream(response, displayMessage, MediaTypeNames.Text.Plain, HttpStatusCode.BadRequest);
                        }
                    }
                    else
                    {
                        WriteToResponseStream(response, null, null, HttpStatusCode.BadRequest);
                    }

                    break;
            }
        }

        private void GetLatestDepthImageRequest(HttpListenerContext context, HttpListenerResponse response, string runId, ref bool handled)
        {
            switch (context.Request.HttpMethod)
            {
                case "GET":
                    handled = true;
                    if (_isRecorderStarted)
                    {
                        var inputSessionId = context.Request.QueryString["SessionId"];

                        if (inputSessionId == SessionState.SessionId.ToString())
                        {
                            var result = _dataProviderService.GetLatestDepthImage(runId);
                            WriteToResponseStream(response, result, MediaTypeNames.Image.Jpeg, HttpStatusCode.OK, false);
                        }
                        else
                        {
                            WriteToResponseStream(response, null, null, HttpStatusCode.BadRequest);
                        }
                    }
                    else
                    {
                        var displayMessage = "Recorder is not running. Recorder must be started in order to retrieve latest depth image.";
                        WriteToResponseStream(response, displayMessage, MediaTypeNames.Text.Plain, HttpStatusCode.BadRequest);
                    }

                    break;
            }
        }

        private void GetLatestCalculationsTestRequest(HttpListenerContext context, HttpListenerResponse response, string runId, ref bool handled)
        {
            switch (context.Request.HttpMethod)
            {
                case "GET":
                    handled = true;

                    var inputSessionId = context.Request.QueryString["SessionId"];
                    var withImage = Convert.ToBoolean(context.Request.QueryString["WithImage"]);
                    var withPositions = Convert.ToBoolean(context.Request.QueryString["WithPositions"]);
                    var withDistances = Convert.ToBoolean(context.Request.QueryString["WithDistances"]);

                    var result = _dataProviderService.GetLatestCalculationsMock(runId, _generalStopwatch, ++_sequence, withImage, withPositions, withDistances);

                    WriteToResponseStream(response, result, MediaTypeNames.Application.Json, HttpStatusCode.OK);
                    break;
            }
        }

        private void GetSessionCalculationsRequest(HttpListenerContext context, HttpListenerResponse response, string runId, ref bool handled)
        {
            switch (context.Request.HttpMethod)
            {
                case "GET":
                    handled = true;
                    var fileName = context.Request.QueryString["FileName"];
                    var inputPatientId = context.Request.QueryString["PatientId"];

                    var withPositions = Convert.ToBoolean(context.Request.QueryString["WithPositions"]);
                    var withDistances = Convert.ToBoolean(context.Request.QueryString["WithDistances"]);

                    if (fileName != null && inputPatientId != null)
                    {
                        var result = _dataProviderService.GetSessionCalculations(inputPatientId, runId, fileName, withPositions, withDistances);
                        WriteToResponseStream(response, result, MediaTypeNames.Application.Json, HttpStatusCode.OK);

                        if (result.Count > 0)
                        {
                            WriteToResponseStream(response, result, MediaTypeNames.Application.Json, HttpStatusCode.OK);
                        }
                        else
                        {
                            var displayMessage = "Requested file was not found";
                            _logger.LogInformation(displayMessage);

                            WriteToResponseStream(response, displayMessage, MediaTypeNames.Text.Plain, HttpStatusCode.BadRequest);
                        }
                    }
                    else
                    {
                        WriteToResponseStream(response, null, null, HttpStatusCode.BadRequest);
                    }

                    break;
            }
        }

        private void GetLatestCalculationsRequest(HttpListenerContext context, HttpListenerResponse response, string runId, ref bool handled)
        {
            switch (context.Request.HttpMethod)
            {
                case "GET":
                    handled = true;
                    if (_isRecorderStarted)
                    {
                        var inputSessionId = context.Request.QueryString["SessionId"];
                        var withImage = Convert.ToBoolean(context.Request.QueryString["WithImage"]);
                        var withPositions = Convert.ToBoolean(context.Request.QueryString["WithPositions"]);
                        var withDistances = Convert.ToBoolean(context.Request.QueryString["WithDistances"]);

                        if (inputSessionId == SessionState.SessionId.ToString())
                        {
                            var result = _dataProviderService.GetLatestCalculations(runId, withImage, withPositions, withDistances);

                            WriteToResponseStream(response, result, MediaTypeNames.Application.Json, HttpStatusCode.OK);
                        }
                        else
                        {
                            var displayMessage = "Failed to retrieve latest calculations";
                            WriteToResponseStream(response, displayMessage, MediaTypeNames.Text.Plain, HttpStatusCode.BadRequest);
                        }
                    }
                    else
                    {
                        var displayMessage = "Recorder is not running. Recorder must be started in order to retrieve latest calculations.";
                        WriteToResponseStream(response, displayMessage, MediaTypeNames.Application.Json, HttpStatusCode.BadRequest);
                    }
                    
                    break;
            }
        }

        private void CommandRequest(HttpListenerContext context, HttpListenerResponse response, string runId, ref bool handled)
        {
            var isSuccess = true;
            switch (context.Request.HttpMethod)
            {
                case "POST":
                    handled = true;

                    CommandDto? command = null;
                    using (var body = context.Request.InputStream)
                    using (var reader = new StreamReader(body, context.Request.ContentEncoding))
                    {
                        //Get the data that was sent to us
                        var inputJson = reader.ReadToEnd();
                        command = inputJson == null ? null : JsonConvert.DeserializeObject<CommandDto>(inputJson);
                    }

                    string displayMessage = string.Empty;

                    if (command != null && command.Name != null)
                    {
                        switch (command.Name.ToLower())
                        {
                            case "startrecorder":
                                if (!_isRecorderStarted)
                                {
                                    SessionState.SessionId = Guid.NewGuid();                                   

                                    var recorderFps = Convert.ToInt16(command.Properties["Fps"]);
                                    var patientId = Convert.ToString(command.Properties["PatientId"]);

                                    _cancellationTokenSource = new CancellationTokenSource();
                                    CancellationToken cancellationToken = _cancellationTokenSource.Token;
                                    new TaskFactory().StartNew(() => _recorderService.StartRecorder(patientId, recorderFps, runId, cancellationToken), cancellationToken, TaskCreationOptions.LongRunning, TaskScheduler.Default);

                                    var result = new Dictionary<string, object>()
                                    {
                                        { "SessionId", SessionState.SessionId }
                                    };

                                    _isRecorderStarted = true;
                                    WriteToResponseStream(response, result, MediaTypeNames.Application.Json, HttpStatusCode.OK);
                                }
                                else
                                {
                                    displayMessage = "Attemp to start recorder, which is already running";
                                    WriteToResponseStream(response, displayMessage, MediaTypeNames.Text.Plain, HttpStatusCode.BadRequest);

                                    _logger.LogInformation(displayMessage);
                                }
                                break;
                            case "stoprecorder":
                                if (_isRecorderStarted)
                                {
                                    _recorderService.StopRecorder(runId, _cancellationTokenSource);
                                    _isRecorderStarted = false;

                                    WriteToResponseStream(response, null, null, HttpStatusCode.OK);
                                }
                                else
                                {
                                    displayMessage = "Attemp to stop recorder, which is not running";
                                    WriteToResponseStream(response, displayMessage, MediaTypeNames.Text.Plain, HttpStatusCode.BadRequest);

                                    _logger.LogInformation(displayMessage);
                                }
                                break;
                        }
                    }
                    break;
            }
        }

        private bool WriteToResponseStream(HttpListenerResponse response, object? responseBody, string? contentType, HttpStatusCode statusCode = HttpStatusCode.OK, bool serialize = true, string? fileName = null)
        {
            response.StatusCode = (int)statusCode;

            if (responseBody != null)
            {
                if (!string.IsNullOrEmpty(fileName))
                {
                    response.Headers.Add("Content-Disposition", $"attachment; filename = {fileName}");
                }

                var buffer = Array.Empty<byte>();
                //This is what we want to send back
                if (responseBody != null && serialize)
                {
                    var serialized = JsonConvert.SerializeObject(responseBody);
                    buffer = Encoding.UTF8.GetBytes(serialized);
                }
                else if (responseBody != null)
                {
                    buffer = (byte[])responseBody;
                }

                //Write it to the response stream
                response.ContentType = contentType;
                response.ContentLength64 = buffer.Length;
                response.OutputStream.Write(buffer, 0, buffer.Length);
            }            

            return true;
        }
    }
}