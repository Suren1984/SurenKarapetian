using BodyMotionDto;
using BodyMotionDto.Joints;
using Microsoft.Extensions.Configuration;
using Microsoft.TeamFoundation.TestManagement.WebApi;
using Microsoft.VisualStudio.Services.CircuitBreaker;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using static Microsoft.VisualStudio.Services.Graph.GraphResourceIds;

namespace BodyMotionCore
{
    public class CoreServices
    {
        HttpClient _httpClient;

        private static readonly Lazy<CoreServices> lazy = new Lazy<CoreServices>(() => new CoreServices());

        public static CoreServices Instance { get { return lazy.Value; } }

        private CoreServices()
        {
            _httpClient = new HttpClient();
        }

        public async Task<string> GetTestStringDataAsync(string url)
        {
            var result = await _httpClient.GetAsync(url);
            if (result.StatusCode == System.Net.HttpStatusCode.OK)
            {
                return await result.Content.ReadAsStringAsync();


            }
            return string.Empty;
        }

        public async Task CommandRequestAsync(string url)
        {
            var result = await _httpClient.GetAsync($"{url}command");
            if (result.StatusCode == System.Net.HttpStatusCode.OK)
            {
                //return await result.Content.ReadAsStringAsync();


            }
            //return string.Empty;
        }

        public async Task<SegmentDto> GetLatestCalculationsAsync(string url, Guid sessionId)
        {
            // var uri = $"{url}GetLatestCalculations?SessionId={sessionId.ToString()}&WithImage=true&WithPositions=false"; // TODO: spravit poriadok s adresami a parametrami, parametre posielat cez parametre metody
            // var result = await _httpClient.GetAsync($"{url}getlatestcalculationstest?SessionId={sessionId.ToString()}&WithImage=true&WithPositions=false");
            var result = await _httpClient.GetAsync($"{url}GetLatestCalculations?SessionId={sessionId.ToString()}&WithImage=true&WithPositions=true&WithDistances=true");
            if (result.StatusCode == System.Net.HttpStatusCode.OK)
            {
                var jsonString = await result.Content.ReadAsStringAsync();
                //return null;
                return JsonConvert.DeserializeObject<SegmentDto>(jsonString);
                //return JsonConvert.DeserializeObject<AnglesDto>(JsonConvert.DeserializeObject<ResponseDto>(jsonString).Result.ToString());
            }


            //  if (result.StatusCode == System.Net.HttpStatusCode.BadRequest)

            return null;
        }

        public async Task GetAllCalculationsRequestAsync(string url)
        {
            var result = await _httpClient.GetAsync($"{url}getallcalculations");
            if (result.StatusCode == System.Net.HttpStatusCode.OK)
            {
                //return await result.Content.ReadAsStringAsync();


            }
            //return string.Empty;
        }

        public async Task GetJointsPositionsAsync(string url)
        {
            var result = await _httpClient.GetAsync($"{url}getjointspositions");
            if (result.StatusCode == System.Net.HttpStatusCode.OK)
            {
                //return await result.Content.ReadAsStringAsync();


            }
            //return string.Empty;
        }

        #region Commands

        public async Task<byte[]> DownloadMeasurementsAsync(string url, Guid patientId, string filename)
        {
            var result = await _httpClient.GetAsync($"{url}downloadcalculationsbinary?PatientId={patientId}&FileName={filename}&WithPositions=true&WithDistances=true");
            if (result.StatusCode == System.Net.HttpStatusCode.OK)
            {
                string binaryFile = await result.Content.ReadAsStringAsync();
                ;
                // return JsonConvert.DeserializeObject<List<FileMetadata>>(jsonString);
            }

            return null;
        }

        public async Task<List<FileMetadata>> GetLastMeasurementsAsync(string url, Guid patientId)
        {
            var x = $"{url}getpatientcalculationslist?PatientId={patientId}&PageNumber=0&RecordsPerPage=1000";
            var result = await _httpClient.GetAsync($"{url}getpatientcalculationslist?PatientId={patientId}&PageNumber=0&RecordsPerPage=1000");
            if (result.StatusCode == System.Net.HttpStatusCode.OK)
            {
                string jsonString = await result.Content.ReadAsStringAsync();

                return JsonConvert.DeserializeObject<List<FileMetadata>>(jsonString);
            }

            return null;
        }

        public async Task<Guid> StartRecorderAsync(string url, Guid patientId, int fps)
        {
            Dictionary<string, object> Properties = new Dictionary<string, object>();
            Properties.Add("PatientId", patientId);
            Properties.Add("Fps", fps);

            CommandDto command = new CommandDto() { Name = "StartRecorder", Properties = Properties };
            var result = await _httpClient.PostAsJsonAsync<CommandDto>($"{url}Command", command);
            if (result.StatusCode == System.Net.HttpStatusCode.OK)
            {
                string jsonString = await result.Content.ReadAsStringAsync();
                if (jsonString != null)
                {
                    var parsedObject = JObject.Parse(jsonString);
                    var sessionId = parsedObject["SessionId"].ToString();
                    return new Guid(sessionId);
                }
            }

            return Guid.Empty;
        }

        public async Task<Guid> StopRecorderAsync(string url)
        {
            CommandDto command = new CommandDto() { Name = "StopRecorder" };
            var result = await _httpClient.PostAsJsonAsync<CommandDto>($"{url}Command", command);
            if (result.StatusCode == System.Net.HttpStatusCode.OK)
            {
                ;
                /*
                string jsonString = await result.Content.ReadAsStringAsync();
                if (jsonString != null)
                {
                    ResponseDto response = (ResponseDto)JsonConvert.DeserializeObject<ResponseDto>(jsonString).Result;

                    // return new Guid(response.RunId); // TODO:
                }
                */
            }

            return Guid.Empty;
        }

        public async Task<Guid> StartCalibrateCameraAsync(string url)
        {
            CommandDto command = new CommandDto() { Name = "StartCalibrateCamera" };
            var result = await _httpClient.PostAsJsonAsync<CommandDto>($"{url}Command", command);
            if (result.StatusCode == System.Net.HttpStatusCode.OK)
            {
                /*
                string jsonString = await result.Content.ReadAsStringAsync();
                if (jsonString != null)
                {
                    ResponseDto response = (ResponseDto)JsonConvert.DeserializeObject<ResponseDto>(jsonString).Result;

                    return new Guid(response.RunId);
                }
                */
            }

            return Guid.Empty;
        }

        public async Task<Guid> StopCalibrateCameraAsync(string url)
        {
            CommandDto command = new CommandDto() { Name = "StopCalibrateCamera" };
            var result = await _httpClient.PostAsJsonAsync<CommandDto>($"{url}Command", command);
            if (result.StatusCode == System.Net.HttpStatusCode.OK)
            {
                /*
                string jsonString = await result.Content.ReadAsStringAsync();
                if (jsonString != null)
                {
                    ResponseDto response = (ResponseDto)JsonConvert.DeserializeObject<ResponseDto>(jsonString).Result;

                    return new Guid(response.RunId);
                }
                */
            }

            return Guid.Empty;
        }
        #endregion Commands

        #region Callbacks
        public async void CallbackRunAsync(object state)
        {
            CallbackTransferClass transferClass = state as CallbackTransferClass; // TODO: spravit poriadok s adresou a aprametrami
            SegmentDto data = await BodyMotionCore.CoreServices.Instance.GetLatestCalculationsAsync($"{transferClass.URL}", transferClass.SessionId); // ?WithImage=true
            GeneralTransferData transferData = transferClass.TransferredObject2 as GeneralTransferData;

            TimeSpan time = TimeSpan.FromMilliseconds(data.Duration);
            DateTime startdate = new DateTime(time.Ticks);
            transferData.Duration = startdate.ToString("HH:mm:ss.f");

            SegmentDtoMapperr(data, (transferClass.TransferredObject as SegmentDto));
        }

        public async void CallbackCalibrationAsync(object state)
        {
            CallbackTransferClass transferClass = state as CallbackTransferClass;
            SegmentDto data = await BodyMotionCore.CoreServices.Instance.GetLatestCalculationsAsync(transferClass.URL, transferClass.SessionId); // TODO: kalibracia pristroja
            SegmentDtoMapperr(data, (transferClass.TransferredObject as SegmentDto));
        }
        #endregion Callbacks

        #region Mappers
        private void SegmentDtoMapperr(SegmentDto segmentJointsDtoSource, SegmentDto segmentJointsDtoDestination)
        {
            segmentJointsDtoDestination.Angles.ShoulderAbductionFrontalAdductionRight = segmentJointsDtoSource.Angles.ShoulderAbductionFrontalAdductionRight;
            segmentJointsDtoDestination.Angles.ShoulderAbductionFrontalAdductionLeft = segmentJointsDtoSource.Angles.ShoulderAbductionFrontalAdductionLeft;
            segmentJointsDtoDestination.Angles.ShoulderAbductionTransversalAdductionLeft = segmentJointsDtoSource.Angles.ShoulderAbductionTransversalAdductionLeft;
            segmentJointsDtoDestination.Angles.ShoulderAbductionTransversalAdductionRight = segmentJointsDtoSource.Angles.ShoulderAbductionTransversalAdductionRight;
            segmentJointsDtoDestination.Angles.ShoulderFlexionExtensionLeft = segmentJointsDtoSource.Angles.ShoulderFlexionExtensionLeft;
            segmentJointsDtoDestination.Angles.ShoulderFlexionExtensionRight = segmentJointsDtoSource.Angles.ShoulderFlexionExtensionRight;

            segmentJointsDtoDestination.Angles.HipAbductionFrontalAdductionLeft = segmentJointsDtoSource.Angles.HipAbductionFrontalAdductionLeft;
            segmentJointsDtoDestination.Angles.HipAbductionFrontalAdductionRight = segmentJointsDtoSource.Angles.HipAbductionFrontalAdductionRight;
            segmentJointsDtoDestination.Angles.HipAbductionTransversalAdductionLeft = segmentJointsDtoSource.Angles.HipAbductionTransversalAdductionLeft;
            segmentJointsDtoDestination.Angles.HipAbductionTransversalAdductionRight = segmentJointsDtoSource.Angles.HipAbductionTransversalAdductionRight;
            segmentJointsDtoDestination.Angles.HipFlexionExtensionLeft = segmentJointsDtoSource.Angles.HipFlexionExtensionLeft;
            segmentJointsDtoDestination.Angles.HipFlexionExtensionRight = segmentJointsDtoSource.Angles.HipFlexionExtensionRight;

            segmentJointsDtoDestination.Angles.KneeFlexionExtensionLeft = segmentJointsDtoSource.Angles.KneeFlexionExtensionLeft;
            segmentJointsDtoDestination.Angles.KneeFlexionExtensionRight = segmentJointsDtoSource.Angles.KneeFlexionExtensionRight;
            segmentJointsDtoDestination.Angles.KneeAbductionAdductionLeft = segmentJointsDtoSource.Angles.KneeAbductionAdductionLeft;
            segmentJointsDtoDestination.Angles.KneeAbductionAdductionRight = segmentJointsDtoSource.Angles.KneeAbductionAdductionRight;

            segmentJointsDtoDestination.Angles.ElbowFlexionExtensionLeft = segmentJointsDtoSource.Angles.ElbowFlexionExtensionLeft;
            segmentJointsDtoDestination.Angles.ElbowFlexionExtensionRight = segmentJointsDtoSource.Angles.ElbowFlexionExtensionRight;

            segmentJointsDtoDestination.Angles.SpineLateroflexion = segmentJointsDtoSource.Angles.SpineLateroflexion;
            segmentJointsDtoDestination.Angles.CervicalFlexion = segmentJointsDtoSource.Angles.CervicalFlexion;
            segmentJointsDtoDestination.Angles.LumbarFlexion = segmentJointsDtoSource.Angles.LumbarFlexion;
            segmentJointsDtoDestination.Angles.SpineRotation = segmentJointsDtoSource.Angles.SpineRotation;
            segmentJointsDtoDestination.Angles.ThoracicFlexion = segmentJointsDtoSource.Angles.ThoracicFlexion;


            segmentJointsDtoDestination.Sequence = segmentJointsDtoSource.Sequence;
            segmentJointsDtoDestination.TimeStamp = segmentJointsDtoSource.TimeStamp;

            segmentJointsDtoDestination.DepthImage = segmentJointsDtoSource.DepthImage;

            if (segmentJointsDtoSource.DepthImage != null)
            {
                segmentJointsDtoDestination.DepthImageBin = Convert.FromBase64String(segmentJointsDtoSource.DepthImage);
            }
        }
        #endregion Mappers

    }
}
