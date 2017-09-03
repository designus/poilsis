import * as React from 'react';
import * as autoBind from 'react-autobind';
import styled, { StyledFunction } from 'styled-components';
import IconButton from 'material-ui/IconButton';
import ChevronLeft from 'material-ui-icons/ChevronLeft';
import ChevronRight from 'material-ui-icons/ChevronRight';
import { SelectBox } from '../selectBox';

export const PaginationToolbar = styled.div`
	border-top: 1px solid #F0F0F0;
	padding: 10px;
	display: flex;
`;

export const PaginationNav = styled.div`
	flex: 3;
	display: flex;
	justify-content: left;
`;

export const PaginationLinks = styled.div`
	display: flex;
	align-items: center;

	ul {
		margin: 0;
		padding: 0;
	}	
`;

interface IPaginationLinkProps {
	isActive: boolean;
}

const li: StyledFunction<IPaginationLinkProps & React.HTMLProps<any>> = styled.li;

export const PaginationLink = li`
	display: inline-block;
	padding: 0 5px;
	list-style: none;
	& > span {
		cursor: pointer;
		background: ${props => props.isActive ? '#4286f4' : '#F0F0F0'};
		color: ${props => props.isActive ? '#fff' : '#1c1c1c'};
		padding: 3px 6px;
	}
`;

export const PaginationUtils = styled.div`
	flex: 1;
	text-align:right;
	display: flex;
	justify-content: flex-end;
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

export const extendWithPagination = (WrappedComponent) => {

	return class extends React.Component<any, any> {
		constructor(props) {
			super(props);
			autoBind(this);

			const allData = Object.keys(props.dataMap);

			this.state = {
				offset: 0,
				limit: props.limit,
				pageData: allData.slice(0, this.props.limit),
				currentPage: 1,
				pages: Math.ceil(allData.length / props.limit),
				allData,
			};
		}

		getOffset(pageNumber, limit) {
			return pageNumber * limit - limit;
		}

		paginateNewData(newData: string[]) {
			const { limit, currentPage } = this.state;
			const offset = this.getOffset(currentPage, limit);
			this.setState({
				pageData: newData.slice(offset, offset + limit),
				allData: newData,
			});
		}

		paginate = (nextPage) => {
			const { allData, limit } = this.state;
			const offset = this.getOffset(nextPage, limit);
			this.setState({
				pageData: allData.slice(offset, offset + limit),
				currentPage: nextPage,
			});
		}

		getPageNumber(total) {
			const { currentPage, limit } = this.state;
			const topLimit = currentPage * limit;
			return `${topLimit - limit + 1} - ${topLimit <= total ? topLimit : total} of ${total}`;
		}

		getPaginationLinks(pageCount: number, currentPage: number) {
			return (
				<ul>
					{[...Array(pageCount)].map((_, i) => {
						return (
							<PaginationLink
								isActive={i + 1 === currentPage}
								onClick={this.paginate.bind(this, i + 1)}
								key={i}
							>
								<span>{i + 1}</span>
							</PaginationLink>
						);
					})}
				</ul>
			);
		}

		handleLimitChange(e) {
			const allData = this.state.allData;
			const limit = Number(e.target.value) || allData.length;
			const pageData = allData.slice(0, limit);
			const pages = Math.ceil(allData.length / limit);
			const currentPage = 1;
			this.setState({limit, pageData, currentPage, pages});
		}

		getLimitOptions() {
			const options = [...Array(Math.floor(this.state.allData.length / this.props.limit))].map((_, i) => (i + 1) * this.props.limit);
			return [...options, 'show all'];
		}

		render() {

			const { pages, currentPage, pageData } = this.state;
			const total = this.state.allData.length;

			return (
				<div>
					<WrappedComponent
						pageData={pageData}
						handleNewData={this.paginateNewData}
						{...this.props}
					/>
					<PaginationToolbar>
						<PaginationNav>
							<IconButton
								disabled={currentPage === 1}
								onClick={this.paginate.bind(this, currentPage - 1)}
							>
								<ChevronLeft />
							</IconButton>
							<PaginationLinks>
								{this.getPaginationLinks(pages, currentPage)}
							</PaginationLinks>
							<IconButton
								disabled={currentPage + 1 > pages}
								onClick={this.paginate.bind(this, currentPage + 1)}
							>
								<ChevronRight />
							</IconButton>
						</PaginationNav>
						<PaginationUtils>
							<PageLimit>
								<SelectBox
									label="Limit"
									value={this.state.limit}
									onChange={this.handleLimitChange}
									data={this.getLimitOptions()}
								/>
							</PageLimit>
							<PageNumber>
								{this.getPageNumber(total)}
							</PageNumber>
						</PaginationUtils>
					</PaginationToolbar>
				</div>
			);
		}
	};
};
