import styled from '@emotion/styled';

interface InputType {
    value: string;
    onChange: any;
    placeholder: string;
    type?: string;
}

const InputBox2: React.FC<InputType> = ({
    value,
    onChange,
    placeholder,
    type,
}) => {
    return (
        <InputWrapper>
            <InputText
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                type={type}
            />
        </InputWrapper>
    );
};

const InputText = styled.input`
    background: none;
    font-size: 16px;
    color: var(--contentColor);
    border: none;
    &::placeholder {
        color: var(--inputColor);
    }
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
        transition: background-color 5000s ease-in-out 0s;
    }
    outline: none;
    width: 100%;
    padding: auto;
`;

const InputWrapper = styled.div`
    background: var(--boxColor);
    border: 1px solid var(--borderColor);
    border-radius: 6px;
    width: 383px;
    height: 47px;
    padding: 14px 17px;
    display: flex;
    align-items: center;
`;

export default InputBox2;
