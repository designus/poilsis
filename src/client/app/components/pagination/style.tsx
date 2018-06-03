import styled from 'styled-components';

export const PaginationToolbar = styled.div`
  border-top: 1px solid #F0F0F0;
  padding: 10px;
  display: flex;
`;

export const PaginationNav = styled.div`
  flex: 3;
  display: flex;
  justify-content: left;
  & > button {
    height: auto;
  }
`;

export const PaginationLinks = styled.div`
  display: flex;
  align-items: center;

  ul {
    margin: 0;
    padding: 0;
  }
`;

export const PaginationLink = styled.li`
  display: inline-block;
  padding: 0 5px;
  list-style: none;
  & > span {
    cursor: pointer;
    background: ${(props: any) => props.isActive ? '#4286f4' : '#F0F0F0'};
    color: ${(props: any) => props.isActive ? '#fff' : '#1c1c1c'};
    padding: 3px 6px;
  }
` as any;

export const PaginationUtils = styled.div`
  flex: 1;
  display: flex;
`;

export const PageNumber = styled.div`
  display: flex;
  padding: 0 10px;
  align-items: center;
  justify-content: flex-end;
`;

export const PageLimit = PageNumber.extend`
  border-right: 1px solid #ccc;
`;
