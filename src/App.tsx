import { useEffect, useRef, useState } from 'react';
import './App.css';
import {
    Button1,
    Button2,
    Button3,
    Button4,
    ShadowBox,
} from './components/Atomic';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import client from './lib/client';
import { useQuery } from '@tanstack/react-query';
import { weeksTypes } from './constants';
import { weeksString } from './constants/weeksString';
import TodoItem from './components/TodoItem';
import InputBox2 from './components/InputBox2';
import { typeToString } from './constants/typetoString';

interface User {
    id: string;
    username: string;
    createdOn?: Date;
}

interface Task {
    id: string;
    title: string;
    createdOn?: Date;
}

interface Todo {
    id: string;
    title: string;
    type: string;
    createdOn?: Date;
    owner: User;
    tasks?: Task[];
    isDone: boolean;
}

const App = () => {
    const navigate = useNavigate();
    const date = new Date();
    const [inputText, setInputText] = useState<string>('');
    const [modalMode, setModalMode] = useState<string>('');
    const [currentType, setCurrentType] = useState<string>('');
    const [modalShow, setModalshow] = useState(false);
    const [removeId, setRemoveId] = useState<string>('');
    const [editId, setEditId] = useState<string>('');
    const [currentTodo, setCurrentTodo] = useState<Todo | null>();

    useEffect(() => {
        document.title = '메인';
        if (localStorage.getItem('accessToken') == null) {
            navigate('/login', { replace: true });
        }
        client.defaults.headers.common[
            'Authorization'
        ] = `Bearer ${localStorage.getItem('accessToken')}`;
    }, []);

    const username = localStorage.getItem('username');

    const addTodo = () => {
        if (inputText.trim() != '')
            client
                .post(`/todo`, { title: inputText.trim(), type: currentType })
                .then((_res) => {
                    setModalshow(false);
                    setInputText('');
                    setCurrentType('');
                    setModalMode('');
                });
        else alert('할 일을 입력해주세요.');
    };

    const editTodo = () => {
        client
            .put(`/todo/${editId}`, { ...currentTodo, title: inputText })
            .then((_res) => {
                setModalshow(false);
                setInputText('');
                setCurrentType('');
                setModalMode('');
            });
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        navigate('/login', { replace: true });
    };

    const showLogoutModal = () => {
        setModalMode('logout');
        setModalshow(true);
    };

    const showRemoveModal = (id: string) => {
        setModalMode('remove');
        setModalshow(true);
        setRemoveId(id);
    };

    const showAddTodo = (type: string) => {
        setCurrentType(type);
        setModalMode('add');
        setModalshow(true);
        setInputText('');
    };

    const showEditModal = (todo: Todo) => {
        setModalMode('edit');
        setModalshow(true);
        setInputText(todo.title);
        setEditId(todo.id);
        setCurrentTodo(todo);
    };

    const cancelModal = () => {
        setCurrentType('');
        setModalMode('');
        setModalshow(false);
        setInputText('');
    };

    const getEverydayTodo = async () => {
        const { data } = await client.get<Todo[]>(
            'todo/findByType/TYPE_EVERYDAY',
        );
        return data;
    };

    const { data: everydayTodoData } = useQuery<Todo[], Error>(
        ['everydayTodos'],
        getEverydayTodo,
        {
            refetchInterval: 500,
        },
    );

    const getWeeksTodo = async () => {
        const { data } = await client.get<Todo[]>(
            `todo/findByType/${weeksTypes[date.getDay()]}`,
        );
        return data;
    };

    const { data: weeksTodoData } = useQuery<Todo[], Error>(
        ['weeksTodos'],
        getWeeksTodo,
        {
            refetchInterval: 500,
        },
    );

    const getTodayTodo = async () => {
        const { data } = await client.get<Todo[]>(
            `todo/findByType/${date.getFullYear()}-${
                date.getMonth() + 1
            }-${date.getDate()}`,
        );
        return data;
    };

    const { data: todayTodoData } = useQuery<Todo[], Error>(
        ['todayTodos'],
        getTodayTodo,
        {
            refetchInterval: 500,
        },
    );

    const removeTodo = (todoId: string) => {
        client.delete(`/todo/${todoId}`).then((_res) => {
            setModalMode('');
            setModalshow(false);
            setRemoveId('');
        });
    };

    const todoDone = (todo: any) => {
        client.put(`/todo/${todo.id}`, { ...todo, isDone: !todo.isDone });
    };

    return (
        <>
            <PageWrapper>
                <WelcomeMessage>
                    <WelcomeTitle>
                        👋 안녕하세요, <UserName>{username}님</UserName>
                    </WelcomeTitle>
                    <WelcomeSubtitle>
                        오늘도 좋은 하루 보내세요 !
                    </WelcomeSubtitle>
                </WelcomeMessage>
                <TodoBoxContainer>
                    <TodoBoxNotToday>
                        <TodoBoxWrapper>
                            <TodoBoxContent>
                                <FlexBetween>
                                    <TodoBoxTitle>
                                        매일 해야하는 할일 목록
                                    </TodoBoxTitle>
                                    <TodoLeft>
                                        {everydayTodoData &&
                                            `${
                                                everydayTodoData.filter(
                                                    (todo: any) => todo.isDone,
                                                ).length
                                            }
                                        
                                        / ${everydayTodoData.length}개 완료`}
                                    </TodoLeft>
                                </FlexBetween>
                                <TodoList>
                                    {everydayTodoData &&
                                        everydayTodoData.map((todo: Todo) => (
                                            <TodoItem
                                                key={todo.id}
                                                title={todo.title}
                                                isDone={todo.isDone}
                                                onChange={() => todoDone(todo)}
                                                onRemove={() =>
                                                    showRemoveModal(todo.id)
                                                }
                                                onEdit={() =>
                                                    showEditModal(todo)
                                                }
                                            />
                                        ))}
                                </TodoList>
                            </TodoBoxContent>
                            <AddButton
                                onClick={() => showAddTodo('TYPE_EVERYDAY')}
                            >
                                추가
                            </AddButton>
                        </TodoBoxWrapper>
                    </TodoBoxNotToday>
                    <TodoBoxNotToday>
                        <TodoBoxWrapper>
                            <TodoBoxContent>
                                <FlexBetween>
                                    <TodoBoxTitle>
                                        {weeksString[date.getDay()]}에 해야하는
                                        할일 목록
                                    </TodoBoxTitle>
                                    <TodoLeft>
                                        {weeksTodoData &&
                                            `${
                                                weeksTodoData.filter(
                                                    (todo: any) => todo.isDone,
                                                ).length
                                            }
                                        
                                        / ${weeksTodoData.length}개 완료`}
                                    </TodoLeft>
                                </FlexBetween>
                                <TodoList>
                                    {weeksTodoData &&
                                        weeksTodoData.map((todo: Todo) => (
                                            <TodoItem
                                                key={todo.id}
                                                title={todo.title}
                                                isDone={todo.isDone}
                                                onChange={() => todoDone(todo)}
                                                onRemove={() =>
                                                    showRemoveModal(todo.id)
                                                }
                                                onEdit={() =>
                                                    showEditModal(todo)
                                                }
                                            />
                                        ))}
                                </TodoList>
                            </TodoBoxContent>
                            <AddButton
                                onClick={() =>
                                    showAddTodo(`${weeksTypes[date.getDay()]}`)
                                }
                            >
                                추가
                            </AddButton>
                        </TodoBoxWrapper>
                    </TodoBoxNotToday>
                    <TodoBoxToday>
                        <TodoBoxWrapper>
                            <TodoBoxContent>
                                <FlexBetween>
                                    <TodoBoxTitle>
                                        오늘 해야하는 할일 목록
                                    </TodoBoxTitle>
                                    <TodoLeft>
                                        {todayTodoData &&
                                            `${
                                                todayTodoData.filter(
                                                    (todo: any) => todo.isDone,
                                                ).length
                                            }
                                        
                                        / ${todayTodoData.length}개 완료`}
                                    </TodoLeft>
                                </FlexBetween>
                                <TodoList>
                                    {todayTodoData &&
                                        todayTodoData.map((todo: Todo) => (
                                            <TodoItem
                                                key={todo.id}
                                                title={todo.title}
                                                isDone={todo.isDone}
                                                onChange={() => todoDone(todo)}
                                                onRemove={() =>
                                                    showRemoveModal(todo.id)
                                                }
                                                onEdit={() =>
                                                    showEditModal(todo)
                                                }
                                            />
                                        ))}
                                </TodoList>
                            </TodoBoxContent>
                            <AddButton
                                onClick={() =>
                                    showAddTodo(
                                        `${date.getFullYear()}-${
                                            date.getMonth() + 1
                                        }-${date.getDate()}`,
                                    )
                                }
                            >
                                추가
                            </AddButton>
                        </TodoBoxWrapper>
                    </TodoBoxToday>
                </TodoBoxContainer>
            </PageWrapper>
            {modalShow && (
                <ModalBackground>
                    <Modal>
                        {modalMode !== 'remove' && modalMode !== 'logout' ? (
                            modalMode === 'add' ? (
                                <ModalTitleGreen>
                                    {Object.keys(typeToString).includes(
                                        currentType,
                                    )
                                        ? typeToString[
                                              currentType as keyof typeof typeToString
                                          ]
                                        : '오늘 해야 할 일 추가하기'}
                                </ModalTitleGreen>
                            ) : (
                                <ModalTitleGreen>
                                    할 일 수정하기
                                </ModalTitleGreen>
                            )
                        ) : modalMode === 'logout' ? (
                            <ModalTitleRed>로그아웃</ModalTitleRed>
                        ) : (
                            <ModalTitleRed>삭제</ModalTitleRed>
                        )}
                        {modalMode !== 'remove' && modalMode !== 'logout' ? (
                            <InputBox2
                                placeholder="할 일을 입력하세요"
                                value={inputText}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => setInputText(e.target.value)}
                            />
                        ) : modalMode === 'logout' ? (
                            <ModalMessage>로그아웃합니다.</ModalMessage>
                        ) : (
                            <ModalMessage>
                                정말로 삭제하시겠습니까?
                            </ModalMessage>
                        )}

                        {modalMode !== 'remove' && modalMode !== 'logout' ? (
                            <ModalActions>
                                <ModalCancelGreen onClick={cancelModal}>
                                    취소
                                </ModalCancelGreen>
                                <ModalConfirmGreen
                                    onClick={
                                        modalMode === 'add'
                                            ? () => addTodo()
                                            : () => editTodo()
                                    }
                                >
                                    {modalMode === 'add' ? '추가' : '수정'}
                                </ModalConfirmGreen>
                            </ModalActions>
                        ) : (
                            <ModalActions>
                                <ModalCancelRed onClick={cancelModal}>
                                    취소
                                </ModalCancelRed>
                                <ModalConfirmRed
                                    onClick={
                                        modalMode === 'logout'
                                            ? () => logout()
                                            : () => removeTodo(removeId)
                                    }
                                >
                                    {modalMode === 'remove'
                                        ? '삭제'
                                        : '로그아웃'}
                                </ModalConfirmRed>
                            </ModalActions>
                        )}
                    </Modal>
                </ModalBackground>
            )}
            <LogoutButton onClick={showLogoutModal}>
                <SpanStrong>{username}</SpanStrong> 님
            </LogoutButton>
        </>
    );
};

const ModalMessage = styled.div`
    font-size: 22px;
    color: var(--contentColor);
    text-align: center;
    width: 100%;
    font-weight: 500;
`;

const LogoutButton = styled.div`
    position: fixed;
    top: 50px;
    font-size: 20px;
    font-weight: 600;
    color: var(--textColor);
    right: calc((100% - 1300px) / 2 + 20px);
    padding: 10px;
    cursor: pointer;
    &:hover {
        background: #e2e9e7;
        border-radius: 7px;
        transition: background 0.3s ease-in-out;
    }
`;

const SpanStrong = styled.span`
    color: var(--accentColor);
`;

const ModalActions = styled.div`
    display: flex;
    align-self: flex-end;
    gap: 10px;
    align-items: center;
`;

const ModalCancelGreen = styled(Button2)`
    width: 90px;
    height: 40px;
`;

const ModalConfirmGreen = styled(Button1)`
    width: 90px;
    height: 40px;
`;

const ModalCancelRed = styled(Button4)`
    width: 90px;
    height: 40px;
`;

const ModalConfirmRed = styled(Button3)`
    width: 90px;
    height: 40px;
`;

const TodoList = styled.div`
    gap: 10px;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 340px;
    overflow: auto;

    &::-webkit-scrollbar {
        display: none;
        width: 0 !important;
    }
`;

const Modal = styled(ShadowBox)`
    width: 423px;
    height: 238px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    position: absolute;
    margin: 0 auto;
    box-shadow: 0px 4px 24px rgba(119, 119, 119, 0.25);
`;

const ModalTitleGreen = styled.div`
    font-weight: 600;
    font-size: 22px;
    color: var(--accentColor);
`;

const ModalTitleRed = styled.div`
    font-weight: 600;
    font-size: 22px;
    color: var(--heavyRed);
`;

const ModalBackground = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999999;
`;

const SearchBar = styled.div`
    display: flex;
    align-items: center;
    width: 455px;
`;

const InputContainer = styled.div`
    width: 100%;
    height: 70px;
    padding: 23px 26px;
    background: #ffffff;
    border: 3px solid #318273;
    display: flex;
    align-items: center;
`;

const SearchInput = styled.input`
    font-size: 20px;
    width: 100%;
    &:focus {
        outline: none;
    }
    outline: none;
    border: none;
`;

const Search = styled.div`
    width: 70px;
    height: 70px;
    background: #318273;
    border: 3px solid #318273;
`;

const PageWrapper = styled.div`
    width: 1300px;
    height: 650px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const WelcomeMessage = styled.div`
    display: flex;
    flex-direction: column;
    gap: 13px;
`;

const WelcomeTitle = styled.div`
    font-weight: 700;
    font-size: 40px;
    color: var(--textColor);
`;
const WelcomeSubtitle = styled.div`
    color: var(--textColor);
    font-size: 35px;
    font-weight: 700;
`;

const UserName = styled.span`
    color: var(--accentColor);
`;

const TodoBoxContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
`;

const TodoBoxNotToday = styled(ShadowBox)`
    width: 390px;
    height: 478px;
    display: flex;
    flex-direction: column;
    padding: 28px 14px 14px;
`;

const TodoBoxToday = styled(ShadowBox)`
    width: 460px;
    height: 478px;
    display: flex;
    flex-direction: column;
    padding: 28px 14px 14px;
`;

const TodoBoxTitle = styled.div`
    font-weight: 600;
    font-size: 20px;
    color: var(--accentColor);
`;

const TodoBoxWrapper = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`;

const AddButton = styled(Button1)`
    width: 100%;
    height: 43px;
`;

const TodoBoxContent = styled.div`
    width: 100%;
    padding: 0 13px;
    height: 384px;
    display: flex;
    flex-direction: column;
    gap: 19px;
    align-items: center;
`;

const FlexBetween = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

const TodoLeft = styled.div`
    font-size: 12px;
    font-weight: 600;
    color: var(--contentColor);
`;

export default App;
