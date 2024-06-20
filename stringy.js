const fs = require("fs");
const OpenAI = require("openai");

const openai = new OpenAI();

const OPENAI_API_KEY = 'sk-proj-ncOnHrLsPDqfi1BiMdvHT3BlbkFJAIYEMqOBke0ulKgwHRhR';

const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

async function apiCall() {
  try {

    const promptText = await readFileAsync('prompt.txt');

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream('life.mp4'),
      model: "whisper-1",
      response_format: "srt",
      // prompt: "keep the timestamps length as 1 second",
      word_timestamps: true
    });

    const completion = await openai.chat.completions.create({
      messages: [
        {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
        { "role": "user", "content": transcription + promptText }
      ],
      response_format: { "type": "json_object" },
      model: "gpt-3.5-turbo",
	  logit_bias : {
		
		// 10: 100,
	
	  }
    });

    return (completion.choices[0]);
	// console.log(completion.choices[0]);

  } catch (error) {
    console.error('Error:', error);
  }
}
function apiOutput() {
    const result =  apiCall(); 
       var csInterface = new CSInterface();
       csInterface.evalScript('$._PPP_.alertOutput("' + result + '")', function(res){
         console.log(res);
       });
 }
 
 apiOutput()