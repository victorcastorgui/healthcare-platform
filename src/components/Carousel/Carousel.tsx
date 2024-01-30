type TCarousel = {
  content1: string;
  content2: string;
  content3: string;
};
function Carousel({ content1, content2, content3 }: TCarousel) {
  return (
    <div className="carousel w-full bg-[#36A5B2] py-[10rem] mt-[6rem] cursor-col-resize">
      <div id="slide1" className="carousel-item relative w-full">
        <h3 className="text-6xl w-4/5 m-auto text-center font-bold text-[#F2F3F9]">
          {content1}
        </h3>
      </div>
      <div id="slide2" className="carousel-item relative w-full">
        <h3 className="text-6xl w-4/5 m-auto text-center font-bold text-[#F2F3F9]">
          {content2}
        </h3>
      </div>
      <div id="slide3" className="carousel-item relative w-full">
        <h3 className="text-6xl w-4/5 m-auto text-center font-bold text-[#F2F3F9]">
          {content3}
        </h3>
      </div>
    </div>
  );
}

export default Carousel;
