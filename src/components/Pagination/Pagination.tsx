import React, {
  ChangeEvent,
  Dispatch,
  useEffect,
  useRef,
  useState,
} from "react";
import Button from "@/components/Button/Button";
import { scrollToTop } from "@/lib/scrollToTop";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { regNumberMoreThanZero } from "@/lib/regexLib";

type TPagination = {
  totalPage: number;
  activePage: number;
  setPage: Dispatch<React.SetStateAction<number>>;
};

const Pagination = ({ totalPage, activePage, setPage }: TPagination) => {
  const pageLimit = 5;
  const veryFirstPage = 1;
  const veryLastPage = totalPage;
  const userInputPage = useRef<HTMLInputElement | null>(null);
  const [arrPage, setArrPage] = useState<number[]>([]);
  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(pageLimit);
  const [isFirstUserInput, setIsFirstUserInput] = useState<boolean>(false);
  const [isSecondUserInput, setIsSecondUserInput] = useState<boolean>(false);
  const [inputPageVal, setInputPageVal] = useState<string>("");

  useOnClickOutside(userInputPage, () => {
    setIsFirstUserInput(false);
    setIsSecondUserInput(false);
  });

  const handleOnClickPageNum = (page: number) => {
    setPage(page);
  };

  const handlePrevPage = () => {
    if (activePage > 1) {
      setPage(activePage - 1);
    }
  };

  const handleNextPage = () => {
    if (activePage < totalPage) {
      setPage(activePage + 1);
    }
  };

  const handleDotClick = (inputDot: number) => {
    switch (inputDot) {
      case 1:
        setIsFirstUserInput(true);
        break;
      case 2:
        setIsSecondUserInput(true);
        break;
    }
  };

  const handleInputPage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setInputPageVal(e.target.value);
      return;
    }
    if (
      regNumberMoreThanZero.test(e.target.value) &&
      parseInt(e.target.value) <= totalPage
    ) {
      setInputPageVal(e.target.value);
    }
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputPageVal !== "") {
      setPage(parseInt(inputPageVal));
      setIsFirstUserInput(false);
      setIsSecondUserInput(false);
      setInputPageVal("");
    }
  };

  useEffect(() => {
    if (
      userInputPage.current !== null &&
      (isFirstUserInput || isSecondUserInput)
    ) {
      userInputPage.current.focus();
    }
  }, [isFirstUserInput, isSecondUserInput]);

  useEffect(() => {
    scrollToTop();
  }, [activePage]);

  useEffect(() => {
    const tempArr: number[] = [];
    for (let j = start; j < end && j < totalPage; j++) {
      tempArr.push(j + 1);
    }
    if (tempArr.includes(activePage)) {
      setArrPage(tempArr);
      return;
    }
    if (activePage > tempArr[4]) {
      setStart(start + pageLimit);
      setEnd(end + pageLimit);
    } else if (activePage < tempArr[0]) {
      setStart(start - pageLimit);
      setEnd(end - pageLimit);
    }
  }, [activePage, end, start, totalPage]);

  return (
    <div className="join sticky bottom-0">
      <Button
        className="join-item btn bg-white"
        onClick={handlePrevPage}
        disabled={activePage === 1 ? true : false}
      >{`<`}</Button>

      {totalPage > pageLimit && !arrPage.includes(veryFirstPage) && (
        <>
          <Button
            className="join-item btn bg-white"
            onClick={() => handleOnClickPageNum(veryFirstPage)}
          >
            {veryFirstPage}
          </Button>
          {isFirstUserInput ? (
            <input
              ref={userInputPage}
              type="text"
              name="firstInputPage"
              className="w-14 text-center font-semibold text-sm z-10"
              value={inputPageVal}
              onChange={handleInputPage}
              onKeyDown={handleOnKeyDown}
            />
          ) : (
            <Button
              className="join-item btn bg-white"
              onClick={() => handleDotClick(1)}
            >{`...`}</Button>
          )}
        </>
      )}

      {arrPage.map((page, idx) => (
        <Button
          key={page + idx}
          className={`join-item btn ${
            activePage === page
              ? "bg-primary text-white border-none"
              : "bg-white"
          } `}
          onClick={() => handleOnClickPageNum(page)}
        >
          {page}
        </Button>
      ))}

      {totalPage > pageLimit && !arrPage.includes(veryLastPage) && (
        <>
          {isSecondUserInput ? (
            <input
              ref={userInputPage}
              type="text"
              name="secondInputPage"
              className="w-14 text-center font-semibold text-sm z-10"
              value={inputPageVal}
              onChange={handleInputPage}
              onKeyDown={handleOnKeyDown}
            />
          ) : (
            <Button
              className="join-item btn bg-white"
              onClick={() => handleDotClick(2)}
            >{`...`}</Button>
          )}
          <Button
            className={`join-item btn ${
              activePage === veryLastPage
                ? "bg-primary text-white border-none"
                : "bg-white"
            }`}
            onClick={() => handleOnClickPageNum(veryLastPage)}
          >
            {veryLastPage}
          </Button>
        </>
      )}

      <Button
        className="join-item btn bg-white"
        onClick={handleNextPage}
        disabled={activePage === totalPage ? true : false}
      >{`>`}</Button>
    </div>
  );
};

export default Pagination;
