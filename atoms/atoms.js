import { atom, useRecoilState, selector } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { useState, useEffect } from 'react';

const { persistAtom } = recoilPersist();

const { persistAtom: questionPersistAtom } = recoilPersist({
  key: 'questions',
  // this key is using to store data in local storage // configurate which stroage will be used to store the data
});
const { persistAtom: userPersistAtom } = recoilPersist({
  key: 'userPersistAtom',
});

const hostDataStateV = atom({
  key: 'hostDataState',
  default: { name: '', roomId: '', connected: false },
  effects_UNSTABLE: [persistAtom],
});

const questionsStateV = atom({
  key: 'questionsState',
  default: [],
  effects_UNSTABLE: [questionPersistAtom],
});

const userStateV = atom({
  key: 'userState',
  default: {
    name: '',
    roomId: '',
    email: '',
    connected: false,
    participantId: null,
  },
  effects_UNSTABLE: [userPersistAtom],
});
// const sortedQuestions = selector({
//   key: 'sortedQuestions',
//   get: ({ get }) => {
//     let questions = get(questionsStateV);

//     return questions;
//   },
// });

export function useHostData() {
  const [isInitial, setIsInitial] = useState(true);
  const [hostDateStateStored, setHostDateStateStored] =
    useRecoilState(hostDataStateV);

  useEffect(() => {
    setIsInitial(false);
  }, []);

  return [
    isInitial === true ? false : hostDateStateStored,
    setHostDateStateStored,
  ];
}

export function useQuestions() {
  const [isInitial, setIsInitial] = useState(true);
  const [questions, setQuestions] = useRecoilState(questionsStateV);

  useEffect(() => {
    setIsInitial(false);
  }, []);

  return [isInitial === true ? false : questions, setQuestions];
}

export function useUserState() {
  const [isInitial, setIsInitial] = useState(true);
  const [userState, setUserState] = useRecoilState(userStateV);

  useEffect(() => {
    setIsInitial(false);
  }, []);

  return [isInitial === true ? false : userState, setUserState];
}

export { hostDataStateV, questionsStateV, userStateV };
