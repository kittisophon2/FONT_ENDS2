import React, { useState, useEffect } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
const Slideshow = () => {
  const slides = [
    {
      url: "/pic/3.1.png",
    },
    {
      url: "/pic/1.png",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(Array(slides.length).fill(0)); // Progress array for each slide

  const slideDuration = 3000; // Duration each slide is shown in ms
  const progressInterval = 100; // Update interval for progress bar in ms
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };
  useEffect(() => {
    // Set progress to 0 for all slides
    setProgress(Array(slides.length).fill(0));

    const progressUpdateInterval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = [...prevProgress];
        newProgress[currentIndex] = (newProgress[currentIndex] + (100 / (slideDuration / progressInterval))) % 100;
        return newProgress;
      });
    }, progressInterval);

    const slideChangeTimeout = setTimeout(() => {
      nextSlide();
    }, slideDuration);

    return () => {
      clearInterval(progressUpdateInterval);
      clearTimeout(slideChangeTimeout);
    };
  }, [currentIndex]);


  return (
    <div className="h-[73vh] w-full relative group">
      <div
        style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
        className="h-full bg-center bg-cover duration-500 shadow-inner w-full"
      ></div>
      {/* Left Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
        <BsChevronCompactLeft onClick={prevSlide} size={30} />
      </div>
      {/* Right Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
        <BsChevronCompactRight onClick={nextSlide} size={30} />
      </div>
      <div className="flex justify-center py-2 absolute top-[95%] md:left-[46%] left-[38%]">
        {slides.map((slide ,slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className="text-2xl cursor-pointer"
          >
            <div className="rhombus1 step4 ml-2 bg-slate-200" >
              <div id="length"></div>
              <div id="progress_animation" style={{ width: `${progress[slideIndex]}%`, transition: `width ${progressInterval}ms linear` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
