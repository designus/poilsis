import * as React from 'react';
import styled from 'styled-components';

const Marked = styled.span`
	background: #efb;
`;

export const MarkedText = ({fullText, markedText}) => {
	const isString = typeof fullText === 'string';
	const pos = isString && fullText.search(new RegExp(markedText, 'i'));

	if (markedText && isString && pos !== -1) {
		const marked = pos === 0 ? `${fullText.slice(0, 1)}${markedText.slice(1)}` : markedText;
		return (
			<span>
				{fullText.slice(0, pos)}
				<Marked>
					{marked}
				</Marked>
				{fullText.slice(pos + markedText.length)}
			</span>
		);
	}

	return (
		<span>
			{fullText}
		</span>
	);
};
