import styled from '@emotion/styled';
import { Checkbox, withStyles } from '@material-ui/core';
import EditRoundedIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add } from '@mui/icons-material';

interface TodoItemProps {
    isDone: boolean;
    onChange: any;
    onRemove: any;
    title: string;
    onEdit: any;
}

const TodoItem: React.FC<TodoItemProps> = ({
    isDone,
    onChange,
    onRemove,
    title,
    onEdit,
}) => {
    return (
        <TodoItemWrapper>
            <TodoItemInner>
                <CustomColorCheckbox checked={isDone} onChange={onChange} />
                {isDone ? (
                    <TodoTitleComplete>{title}</TodoTitleComplete>
                ) : (
                    <TodoTitle>{title}</TodoTitle>
                )}
            </TodoItemInner>
            <TodoItemInner>
                <EditRoundedIcon
                    fontSize="small"
                    sx={{
                        color: 'var(--contentColor)',
                        cursor: 'pointer',
                        fontSize: 10,
                    }}
                    onClick={onEdit}
                />
                <DeleteIcon
                    fontSize="small"
                    sx={{ color: 'var(--contentColor)', cursor: 'pointer' }}
                    onClick={onRemove}
                />
            </TodoItemInner>
        </TodoItemWrapper>
    );
};

const TodoTitle = styled.div`
    font-weight: 600;
    font-size: 12px;
    color: #525252;
`;
const TodoTitleComplete = styled.div`
    font-size: 12px;
    text-decoration-line: line-through;
    color: var(--completeColor);
`;

const TodoItemWrapper = styled.div`
    height: 23px;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    display: flex;
`;

const TodoItemInner = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const CustomColorCheckbox = withStyles({
    root: {
        width: '18px',
        height: '18px',
        color: 'var(--completeColor)',
        '&$checked': {
            color: 'var(--accentColor)',
        },
    },
    checked: {},
})((props: { checked: boolean; onChange: any }) => (
    <Checkbox color="default" {...props} />
));

export default TodoItem;
