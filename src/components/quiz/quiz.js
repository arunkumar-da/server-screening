import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import './quiz.css';
import Checkbox from '@mui/material/Checkbox';
import Webcam from 'react-webcam';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import axios from 'axios';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import swal from 'sweetalert';
import { AppContext } from '../form/appcontext/appcontext';

const Quiz = ({ setIsExamCompleted }) => {
  const HeartIcon = () => <span>&#10084;</span>;
  const [hearts, setHearts] = useState(3);
  const [showExitButton, setShowExitButton] = useState(false);
  const[swalCount,SetswalCount]=useState(1);
  const[upload,setUpload]=useState(false);
  const[exit,setExit] =useState(false);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const { name } = useContext(AppContext);

  const { useremail,username,userphonenumber } = useContext(AppContext);

  const [personCount, setPersonCount] = useState(0);
  const [qnsComplete, setQnsComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTimer, setShowTimer] = useState(true);
  const [key, setKey] = useState(0);
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const initialTime = 1500; // 2 hours in seconds
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [disabled, setDisabled] = useState(true);
  const [checked, setChecked] = useState(false);
  const [shouldRepeat, setShouldRepeat] = useState(false);
  const [data, setData] = useState([]);
  const [remainingTime, setRemainingTime] = useState(60);
  const [model, setModel] = useState(null);
    const [isUploading, setIsUploading] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing media devices.", err);
    }
  };
  requestPermissions();
  }, []);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`http://localhost:3007/getData?role=${name}`);
        setData(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [name]);

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  const videoConstraints = {
    width: window.innerWidth < 576 ? 220 : 480, // Adjusted width for mobile
    height: window.innerWidth < 576 ? 260 : 280, // Adjusted height for mobile
    facingMode: 'user',
    frameRate: { ideal: 10, max: 10 },
  };
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer);
          console.log('Timer expired!');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    setShouldRepeat(true);
    setIsPlaying(true);
    setShowTimer(true);
  }, [currentQuestion]);

  useEffect(() => {
    setShouldRepeat(true);
    setRemainingTime(60);
    const timerId = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timerId);
          setDisabled(false);
          console.log('Timer expired!');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [currentQuestion]);

  const handleStartCaptureClick = () => {
    if (webcamRef.current && webcamRef.current.video) {
      const stream = webcamRef.current.video.srcObject;
      setCapturing(true);
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/webm',
      });
      mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable);
      mediaRecorderRef.current.start();
    } else {
      console.error('Webcam is not ready.');
    }
  };
  const handleDataAvailable = ({ data }) => {
    if (data.size > 0) {
      setRecordedChunks((prev) => prev.concat(data));
    }
  };
  const handleStopCaptureClick = () => {
  
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setCapturing(false);
      if (recordedChunks.length) {
        handleDownload();
        
      }
    }
  };

  const handleDownload = () => {
 

  };
  const performObjectDetection = useCallback(async () => {
    if (!webcamRef.current || !model) return;

    const webcam = webcamRef.current.video;
    if (webcam.readyState === 4) { // Check if video is ready
      const predictions = await model.detect(webcam);

      let personCount = 0;
      let cellPhoneDetected = false;

      predictions.forEach(prediction => {
        if (prediction.class === 'person' && prediction.score > 0.5) {
          personCount++;
          if (personCount > 1) {
            
            const newCount = swalCount + 1;
            SetswalCount(newCount);
            swal("Multi Face Detected");
            if (hearts > 0) {
              setHearts(prevHearts => prevHearts - 1);
            }
            personCount--;
          }
        } else if (prediction.class === 'cell phone' && prediction.score > 0.5) {
          swal("Cell Phone Detected", "Action has been Recorded", "error");
          SetswalCount(prevCount => prevCount + 1);
          cellPhoneDetected = true;
          if (hearts > 0) {
            setHearts(prevHearts => prevHearts - 1);
          }
        }
      });
      
      if (swalCount > 2) {
        swal("The Warning Is Shown More Than 3 Times")
            .then(() => {
                // Send warning email
                const sendWarningEmail = async () => {
                    try {
                        const response = await axios.post('http://localhost:5000/sendWarningEmail', { name: username });

                        console.log(response.data);  // Log response from backend (optional)
                        alert(`Warning email sent successfully for ${username}!`);
                        if (response.status === 200) {
                            navigate('/exit');  // Redirect to exit page
                        }
                    } catch (error) {
                        console.error('Error sending warning email:', error.message);
                        alert('Failed to send warning email. Please try again later.');
                    }
                };

                sendWarningEmail();
            })
            .catch(error => {
                console.error('Error displaying swal:', error.message);
            });
    }

      personCount = 0;
      cellPhoneDetected = false;
    }
  }, [model, swalCount]);
  
  useEffect(() => {
    const detectionInterval = setInterval(() => {
      performObjectDetection();
    }, 2500); // Increase interval to reduce load

    return () => clearInterval(detectionInterval);
  }, [performObjectDetection]);

  

  const handleQuizCompletion = async () => {
    await new Promise((resolve) => {
      handleStopCaptureClick();
      handleDownload(); // Assuming this function returns a promise or can be awaited
      resolve();
      console.log("before");
      setIsUploadComplete(true);
    });
    
  };
  const textData = {
    folderName: username,
  
  };
  useEffect(() => {
    if (!capturing && recordedChunks.length > 0 &&!isUploading) {
      setIsUploading(true);
      const uploadVideo = async () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const formData = new FormData();
        const uploadUrl = `http://localhost:3011/upload/${username}`;
        formData.append('file', blob, ' video.webm');
        
        // 'file' should match your server-side handling
        formData.append('folderName', username);
  
        try {
          const response = await axios.post(uploadUrl, formData ,{
            headers: {
              'Content-Type': 'multipart/form-data'
            }
           
          });
          console.log(' last Video uploaded successfully!', response); 
          alert(username);
          if (exit) {
            try{

              await axios.post('http://localhost:5002/sendWarningEmail', { name: username });
            if (response.status === 200) {

             navigate('/exit');
            } }catch (error) {
              console.error('Error sending email:', error);
            }      
          }
          setRecordedChunks([]);
          setUpload(true);
          setIsUploading(false);
        } catch (error) {
          console.error('Error uploading video:', error);
        }
      };
      
      uploadVideo();
    }
  }, [isUploadComplete,currentQuestion, data.length, handleQuizCompletion, recordedChunks, handleStopCaptureClick, setIsExamCompleted,  capturing]);


  const handleExit = async () => {
    try {
      if (currentQuestion === data.length ) {
        await handleStopCaptureClick();
        await handleDownload();

       
      }
    } catch (error) {
      console.error('Error during stop or download:', error);
    }
  };
  const handleNextQuestion = async () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < data.length) {
      await handleStopCaptureClick();
      await handleDownload();
      setCurrentQuestion(nextQuestion);
      setDisabled(true);
      setChecked(false);
      setShouldRepeat(true);
      setKey((prevKey) => prevKey + 1);
      if (nextQuestion == data.length - 1 ) {
      }
    } else {
         setExit(true);
        
    }
  };
 
  const handleAction = () => {
    handleNextQuestion();
    handleStopCaptureClick();
    handleDownload();
    if(exit){
      navigate('/exit');
    }
    
  };

  const checkChange = (event) => {
    setDisabled(!event.target.checked);
    setChecked(event.target.checked);
    
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (data.length === 0) {
    return <div>Loading...</div>;
  }
  const handleNewButtonClick = () => {
    navigate('/exit');
  };
  
  return (
    <div className='quiz-card'>
       <p className='heart'>Life Line: {Array.from({ length: hearts }, (_, index) => <HeartIcon key={index} />)}</p>
      <h2> {name ? `${name}` : 'Guest'}</h2>
       {/* <h2>{username}</h2>*/}
      {/* <h2>Email: {useremail}</h2>*/}
     {/*  <h2>Phone Number: {userphonenumber}</h2>*/}
      <div className='qns'>
        <h2>{data[currentQuestion].qns}</h2> 
      </div>

      <div className='web'>
        <div style={{ position: 'relative', width: 'fit-content' }}>
          <Webcam
            audio={true}
            ref={webcamRef}
            className='camera'
            videoConstraints={videoConstraints}
            style={{ display: 'block' }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
            }}
          >
            {showTimer && (
              <CountdownCircleTimer
                key={key}
                isPlaying={isPlaying}
                duration={15} // Set the duration to 15 seconds or any other appropriate numeric value
                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                colorsTime={[7, 5, 2, 0]}
                onComplete={() => {
                  setShowTimer(false);
                  if (capturing) {
                    handleStopCaptureClick();
                  }
                  performObjectDetection(); // Call object detection logic
                  handleStartCaptureClick(); // Restart recording
                  return { shouldRepeat: shouldRepeat }; // Make sure shouldRepeat is defined
                }}
              >
                {({ remainingTime }) => (
                  <>
                    <h4>Exam Will Start In  </h4>
                    <div>{remainingTime}</div>
                  </>
                )}
              </CountdownCircleTimer>
            )}
          </div>
        </div>

        <div style={{ marginTop: '10px' }}>
  {capturing ? (
    <Button onClick={handleStopCaptureClick} disabled>Stop Recording</Button>
  ) : (
    <Button onClick={handleStartCaptureClick}disabled>Start Recording</Button>
  )}
 
</div>


        <Checkbox
          className='checkbox'
          checked={checked}
          onChange={checkChange}
          inputProps={{ 'aria-label': 'controlled' }}
        />
        <h3 className='none'>I Don’t Know The Answer</h3>
        <div>
          <button className='next' disabled={disabled} onClick={handleAction}>
            Next {remainingTime}
          </button>
        </div>
        <button className='timer'>{formatTime(timeLeft)}</button>
      </div>
      
    </div>
  );
};
function DesignTwo() {
  return (
    <div style={{ backgroundColor: 'lightgreen', padding: '20px' }}>
      <h1>exit page</h1>
      <p>This is the second design.</p>
    </div>
  );
}

export default Quiz;