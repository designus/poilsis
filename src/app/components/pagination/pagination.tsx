import * as React from 'react';
import * as autoBind from 'react-autobind';
import IconButton from 'material-ui/IconButton';
import ChevronLeft from 'material-ui-icons/ChevronLeft';
import ChevronRight from 'material-ui-icons/ChevronRight';
import { SelectBox } from '../selectBox';
import {
	PaginationToolbar,
	PaginationNav,
	PaginationLinks,
	PaginationLink,
	PaginationUtils,
	PageNumber,
	PageLimit,
} from './style';

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
				pages: this.getPages(allData, props.limit),
				allData,
			};
		}

		getPages(data: string[], limit) {
			return Math.ceil(data.length / limit);
		}

		getOffset(pageNumber, limit) {
			return pageNumber * limit - limit;
		}

		paginateNewData(newData: string[], goToFirstPage = false) {

			const limit = this.state.limit;
			const currentPage = goToFirstPage ? 1 : this.state.currentPage;
			const offset = this.getOffset(currentPage, limit);

			this.setState({
				pageData: newData.slice(offset, offset + limit),
				allData: newData,
				pages: this.getPages(newData, limit),
				currentPage,
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
