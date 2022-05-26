const aiplatform = require('@google-cloud/aiplatform');
const fs = require('fs');

// filename, endpointId, project, location = 'us-central1'

async function main() {
    // [START aiplatform_predict_image_object_detection_sample]
    /**
     * TODO(developer): Uncomment these variables before running the sample.\
     * (Not necessary if passing values as arguments)
     */
  
    const filename = "test_image.png";
    const endpointId = "2446606885848088576";
    const project = "333036159589";
    const location = 'us-central1-aiplatform.googleapis.com';
    
    const {instance, params, prediction} =
      aiplatform.protos.google.cloud.aiplatform.v1.schema.predict;
  
    // Imports the Google Cloud Prediction Service Client library
    const {PredictionServiceClient} = aiplatform.v1;
  
    // Specifies the location of the api endpoint
    const clientOptions = {
      apiEndpoint: 'us-central1-aiplatform.googleapis.com',
    };
  
    // Instantiates a client
    const predictionServiceClient = new PredictionServiceClient(clientOptions);
  
    async function predictImageObjectDetection() {
      // Configure the endpoint resource
      const endpoint = `projects/${project}/locations/${location}/endpoints/${endpointId}`;
  
      const parametersObj = new params.ImageObjectDetectionPredictionParams({
        confidenceThreshold: 0.5,
        maxPredictions: 5,
      });
      const parameters = parametersObj.toValue();
  
      const image = fs.readFileSync(filename, 'base64');
      const instanceObj = new instance.ImageObjectDetectionPredictionInstance({
        content: image,
      });
  
      const instanceVal = instanceObj.toValue();
      const instances = [instanceVal];
      const request = {
        endpoint,
        instances,
        parameters,
      };
  
      // Predict request
      const [response] = await predictionServiceClient.predict(request);
  
      console.log('Predict image object detection response');
      console.log(`\tDeployed model id : ${response.deployedModelId}`);
      const predictions = response.predictions;
      console.log('Predictions :');
      for (const predictionResultVal of predictions) {
        const predictionResultObj =
          prediction.ImageObjectDetectionPredictionResult.fromValue(
            predictionResultVal
          );
        for (const [i, label] of predictionResultObj.displayNames.entries()) {
          console.log(`\tDisplay name: ${label}`);
          console.log(`\tConfidences: ${predictionResultObj.confidences[i]}`);
          console.log(`\tIDs: ${predictionResultObj.ids[i]}`);
          console.log(`\tBounding boxes: ${predictionResultObj.bboxes[i]}\n\n`);
        }
      }
    }
    predictImageObjectDetection();
    // [END aiplatform_predict_image_object_detection_sample]
  }
  
  process.on('unhandledRejection', err => {
    console.error(err.message);
    process.exitCode = 1;
  });


  module.exports = {
      main
  }