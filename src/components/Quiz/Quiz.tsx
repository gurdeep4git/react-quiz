import React, { LegacyRef, MutableRefObject, useEffect, useRef, useState } from 'react'
import ArrowRightImage from '../../assets/arrow-right.svg';
import { countriesData } from '../../data/countries';
import { Country } from '../../model/country.model';
import { Question } from '../../model/question.model';

const Quiz: React.FunctionComponent = () => {

    const [questions, setQuestions] = useState<Question[] | []>([]);
    const [index, setIndex] = useState<number>(0);
    const [option, setOption] = useState<string | null>(null);
    const [answers, setAnswers] = useState<any | null>(null);
    const [result, setResult] = useState<number>(0);
    const [showResult, setShowResult] = useState<Boolean>(false);
    const [retry, setRetry] = useState<boolean>(false)
    const optionsRefs = useRef<Array<any> | Array<null>>([]);

    let question = questions[index];
    let hasNext = index < questions.length - 1;
    let disable = option === null;

    const pickRandom = (arr: Array<Country>, count: number): Array<Country> => {
        let _arr = [...arr];
        return [...Array(count)].map(() => _arr.splice(Math.floor(Math.random() * _arr.length), 1)[0]);
    }

    const prepareOptions = (country: Country): Array<string> => {
        const countries = pickRandom(countriesData, 3);
        const countryNames = countries.map(i => i.name)
        countryNames.push(country.name);

        for (var i = countryNames.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = countryNames[i];
            countryNames[i] = countryNames[j];
            countryNames[j] = temp;
        }

        return countryNames;
    }

    const prepareQuestions = () => {
        const countriesRandom = pickRandom(countriesData, 10);
        const questions = countriesRandom.map((country: Country) => {
            const id = country.unicode;
            const flag = country.image;
            const answer = country.name;
            const options = prepareOptions(country);
            return {
                id,
                flag,
                options,
                answer
            }
        })
        console.log(questions)
        setQuestions(questions)
    }

    useEffect(() => {
        prepareQuestions();
    }, [retry])

    useEffect(() => {
        if (option) {
            disable = false;

            if (optionsRefs?.current?.length > 0) {
                const correctOption = optionsRefs?.current?.find((i) => i?.value === question.answer);
                const selectedOption = optionsRefs?.current?.find((i) => i?.value === option);
                if (correctOption.value === selectedOption.value) {
                    selectedOption.classList.add('bg-green')
                } else {
                    selectedOption.classList.add('bg-red')
                    correctOption.classList.add('bg-green')
                }
            }

        }


    }, [option])

    const onNextClick = () => {
        if (hasNext) {
            setIndex(index + 1)
            setOption(null)
        }
    }

    const onOptionClick = (e: any) => {
        const selectedOption = e.target.value;
        setOption(selectedOption);
        setAnswers((prev: any) => {
            return {
                ...prev,
                [question.id]: selectedOption
            }
        })
    }

    const onFinishClick = () => {
        let counter: number = 0;
        for (const key of Object.keys(answers)) {
            const question = questions?.find((i) => i.id === key);
            if (question?.answer === answers[key]) {
                counter = counter + 1;
            }
        }
        setResult(counter)
        setShowResult(true);
    }

    const onRetryClick = () => {
        setRetry(true);
        setIndex(0);
        setOption(null)
        setAnswers(null)
        setResult(0)
        setShowResult(false);
    }

    return (
        <div style={{
            'backgroundImage': 'linear-gradient(to right, #262d56, #222953, #1e2550, #1a214d, #161d4a)'
        }} className='bg-purple-first h-screen'>
            <div>
                <div style={{
                    'position': 'absolute',
                    'left': '50%',
                    'top': '50%',
                    'transform': 'translate(-50%, -50%)'
                }} className='bg-purple-second rounded-2xl py-12 lg:py-24 text-white-text w-11/12 lg:w-4/5'>
                    <div className='w-11/12 xl:w-2/4 mx-auto text-center'>
                        {
                            !showResult ? (
                                <>
                                    <div className='flex justify-between'>
                                        {
                                            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                                                <div key={i} className={"font-bold w-8 h-8 lg:w-12 lg:h-12 rounded-full text-center text-xl lg:text-2xl lg:leading-10 " + (i === (index + 1) ? 'bg-pink' : 'bg-purple-third')}>{i}</div>
                                            ))
                                        }
                                    </div>
                                    <div>
                                        <p className='text-lg lg:text-3xl font-bold tracking-wide my-6 lg:my-12'>Which country does this flag <img className='inline-block w-20' src={question?.flag} alt='flag' /> belong to?</p>
                                    </div>
                                    <div className='lg:w-11/12 mx-auto'>
                                        <div className='grid gap-6 grid-cols-2'>
                                            {
                                                question?.options.map((opt, index) => (
                                                    <button ref={(input) => optionsRefs.current[index] = input} value={opt} onClick={onOptionClick} key={opt + index} className={'font-bold w-full p-4 lg:p-6 rounded-2xl bg-purple-third'} type='button'>{opt}</button>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <div className='flex justify-center pt-10 lg:pt-20'>
                                        {
                                            !hasNext ? (
                                                <button disabled={disable} onClick={onFinishClick} className='font-bold bg-purple-third px-6 py-4 rounded-2xl' type='button'>Finish</button>
                                            ) : (
                                                <button disabled={disable} onClick={onNextClick} className='font-bold bg-purple-third px-6 py-4 rounded-2xl' type='button'>Next <img alt="next" className='inline-block' src={ArrowRightImage} /></button>
                                            )
                                        }
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className='text-lg lg:text-3xl font-bold tracking-wide'>Your Score is {result}/10</p>
                                    <button onClick={onRetryClick} className='font-bold bg-pink px-6 py-4 rounded-2xl mt-12' type='button'>Retry</button>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Quiz