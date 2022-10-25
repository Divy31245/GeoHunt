// import { style } from "@mui/system";
import Image from "next/image";
import Router from "next/router";
import { useState, useEffect } from "react";
import styles from "../styles/quiz.module.css";
import startImg from "../assets/2.png";
import QuizChat from "../components/QuizChat/QuizChat";
import Withspinner from "../components/Spinner/Withspinner";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
export default function Quiz({ details }) {
  const [currentQuiz, setCurrentQuiz] = useState();
  const [options, setOptions] = useState();
  const questionTypes = ["flag", "capital", "coatOfArms"];
  const noOfOptions = 4;
  const noOfQuestionTypes = questionTypes.length;
  const [countriesDetails, setCountriesDetails] = useState();
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const [gotAnswerRight, setGotAnswerRight] = useState(true);
  const [isResultsPage, setIsResultsPage] = useState(false);
  const [countOfQuestions, setCountOfQuestions] = useState(0);

  const getRandomIntegers = function (optionsCount, countriesCount) {
    const random_list = Array.from({ length: optionsCount }, () =>
      Math.floor(Math.random() * countriesCount)
    );
    const distinct_Random_list = new Set(random_list);
    // In case the random numbers generated are not distinct, call the same function again
    return random_list.length === distinct_Random_list.size
      ? random_list
      : getRandomIntegers(optionsCount, countriesCount);
  };

  const getQuestion = function () {
    if (countriesDetails) {
      let quiz = {};
      // The random numbers generated will be treated as the index of the countries to be used for the quiz as options
      const answer_options = getRandomIntegers(
        noOfOptions,
        countriesDetails.length
      );
      const options_alphabets = ["A. ", "B. ", "C. ", "D. "];
      // Choose one random option as the right answer
      const right_answer =
        answer_options[Math.floor(Math.random() * noOfOptions)];
      // Type of the question also generated randomly
      const type = questionTypes[Math.floor(Math.random() * noOfQuestionTypes)];
      // Depending on the type of question selected, set questions and images if needed
      switch (type) {
        case "flag":
          quiz = {
            image: countriesDetails[right_answer].flags,
            question: "Which country does this flag belong to?",
            answer:
              options_alphabets[
                answer_options.findIndex((element) => element === right_answer)
              ] + countriesDetails[right_answer].name,
          };
          break;
        case "capital":
          quiz = {
            question: `${countriesDetails[right_answer].capital} is the capital of...`,
            answer:
              options_alphabets[
                answer_options.findIndex((element) => element === right_answer)
              ] + countriesDetails[right_answer].name,
          };
          break;
        case "coatOfArms":
          quiz = {
            image: countriesDetails[right_answer].coatOfArms,
            question: "This is the Coat of Arms of...",
            answer:
              options_alphabets[
                answer_options.findIndex((element) => element === right_answer)
              ] + countriesDetails[right_answer].name,
          };
          break;
        default:
          break;
      }
      if (type === "capital" && !countriesDetails[right_answer].capital) {
        getQuestion();
      } else if (type === "flag" && !countriesDetails[right_answer].flags) {
        getQuestion();
      } else if (
        type === "coatOfArms" &&
        !countriesDetails[right_answer].coatOfArms
      ) {
        getQuestion();
      } else {
        setCurrentQuiz(quiz);
        // Using the indices, find the actual names of the countries
        setOptions(
          answer_options.map(
            (option, index) =>
              options_alphabets[index] + countriesDetails[option].name
          )
        );
      }
    }
  };
  const onSubmitAnswer = function (event) {
    const selectedElement = event.target;
    const result = selectedElement.innerHTML === currentQuiz.answer;
    if (result) {
      setCountOfQuestions(countOfQuestions + 1);
      setGotAnswerRight(true);
    } else {
      setGotAnswerRight(false);
      selectedElement.innerHTML +=
        '<span class="material-icons">&#10060;</span>';
    }
    setIsAnswerSelected(event.target);
    selectedElement.classList.add(styles.selected);
  };
  const onClickNext = function () {
    const newQuiz = { ...currentQuiz };
    delete newQuiz["image"];
    setCurrentQuiz(newQuiz);
    isAnswerSelected.classList.remove(styles.selected);
    setGotAnswerRight(false);
    setIsAnswerSelected(false);
    getQuestion();
  };

  useEffect(() => {
    async function getCountryDetails() {
      const url = "https://restcountries.com/v3.1/all";
      try {
        const response = await (await fetch(url)).json();

        const details = response?.map((country) => {
          const countryDetail = {
            name: country.name.common,
            capital: country.capital,
            coatOfArms: country.coatOfArms.png
              ? country.coatOfArms.png
              : country.coatOfArms.svg,
            flags: country.flags.png,
          };
          return countryDetail;
        });

        setCountriesDetails(details);
      } catch (error) {
        console.log(error);
      }
    }
    getCountryDetails();
  }, []);

  return (
    <div className={styles.achha}>
      <div
        className=" absolute top-4 left-4 z-10 cursor-pointer flex items-center "
        onClick={() => Router.back()}
      >
        <KeyboardBackspaceIcon className="hover:mr-2 transition-all hover:animate-pulse duration-75" />
        <span className=" ml-1 hover:ml-2 hover:transition-none hover:animate-pulse hover:duration-75 hover:delay-75">Back</span>
      </div>
      <div className={styles.main}>
        <div className={styles.quizHeading}>Geography Quiz</div>
        <div className={styles.quizContainer}>
          {/* {console.log(countriesDetails)} */}
          {countriesDetails ? (
            <>
              {/* Home Page */}
              {!currentQuiz && !isResultsPage ? (
                <div className={styles.startContainer}>
                  <div className={styles.startButtonImg}>
                    <Image src={startImg} alt="" layout="" />
                    {/* <img
                    src={"/assets/images/quiz-result.PNG"}
                    alt="country-question"
                  ></img> */}
                  </div>
                  <div className={styles.startButtonContainer}>
                    <button
                      className={styles.startButton}
                      onClick={() => getQuestion()}
                    >
                      Start
                    </button>
                  </div>
                </div>
              ) : // Page Showing Results
              isResultsPage ? (
                <div className={styles.resultContainer}>
                  {/* <div className={styles.resultImg}> */}
                  {/* <img
                    src={"/assets/images/quiz-result.PNG"}
                    alt="country-question"
                  ></img> */}
                  {/* </div> */}
                  <div className={styles.resultHeading}>Results</div>
                  <div className={styles.resultCount}>
                    You got{" "}
                    <span className={styles.rightAnswerCount}>
                      {countOfQuestions}
                    </span>{" "}
                    right answers
                  </div>
                  <div className={styles.startButtonContainer}>
                    <button
                      className={styles.tryAgainBtn}
                      onClick={() => {
                        setCurrentQuiz(false);
                        setIsResultsPage(false);
                        setIsAnswerSelected(false);
                        setCountOfQuestions(0);
                        setGotAnswerRight(true);
                      }}
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : (
                // The actual quiz questions and options
                <div className={styles.quizQueContainer}>
                  {currentQuiz.image && (
                    <div className={styles.quizImg}>
                      <Image
                        src={currentQuiz.image}
                        alt="country-question"
                        layout="fill"
                      />
                    </div>
                  )}
                  <div className={styles.quizQuestion}>
                    {currentQuiz?.question}
                  </div>
                  <div className={styles.quizOptions}>
                    {options.map((option, index) => (
                      <button
                        key={index}
                        className={` ${styles.quizOptBtn} ${
                          option === currentQuiz.answer
                            ? `${styles.rightAnswer} ${
                                isAnswerSelected ? styles.selected : ""
                              }`
                            : styles.wrongAnswer
                        } `}
                        onClick={(e) => onSubmitAnswer(e)}
                        disabled={isAnswerSelected}
                      >
                        {option}
                        {option === currentQuiz.answer && isAnswerSelected && (
                          <span className={styles.materialIcons}>&#10003;</span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className={styles.nextResultBtnContainer}>
                    {/* Next Button  shown if answer is right*/}
                    {gotAnswerRight && isAnswerSelected ? (
                      <button
                        className={styles.nextButton}
                        onClick={() => onClickNext()}
                      >
                        Next
                      </button>
                    ) : !gotAnswerRight && isAnswerSelected ? (
                      // Results Button shown if wrong answer is selected
                      <button
                        className={styles.nextButton}
                        onClick={() => setIsResultsPage(true)}
                      >
                        Results
                      </button>
                    ) : null}
                  </div>
                </div>
              )}
            </>
          ) : (
            <Withspinner />
          )}
        </div>
      </div>
      <QuizChat />
    </div>
  );
}

// export const getStaticProps = async () => {
//   const res = await fetch("https://restcountries.com/v3.1/all");
//   const countries = await res.json();
//   const details = countries?.map((country) => {
//     const countryDetails = {
//       name: country.name.common,
//       capital: country.capital ? country.capital : null,
//       coatOfArms: country.coatOfArms.png
//         ? country.coatOfArms.png
//         : country.coatOfArms.svg
//         ? country.coatOfArms.svg
//         : null,
//       flags: country.flags.png,
//     };
//     return countryDetails;
//   });
//   return {
//     props: {
//       details,countryDetails
//     },
//   };
// };
