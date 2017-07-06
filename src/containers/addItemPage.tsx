import * as React from 'react';
import {connect} from 'react-redux';
import AddItemForm from '../components/addItemForm';
import { addNewItemState, postItem } from '../actions';

class AddItemPage extends React.Component<any, any> {

    onItemSubmit(item) {
        this.props.postItem(item);
    }

    onSaveState(state) {
        this.props.addNewItemState(state);
    }

    render() { 
    
        return (
            <div>
                <h1>Pasiskelbkite</h1>
                <AddItemForm 
                    onSaveState={this.onSaveState.bind(this)}
                    onItemSubmit={this.onItemSubmit.bind(this)} 
                    {...this.props} 
                />
            </div>
        )
    }    
}

export const mapStateToProps = (state) => {
    return {
        initialState: state.newItem
    }
}

export const mapDispatchToProps = (dispatch) => {
    return {
        addNewItemState: (state) => dispatch(addNewItemState(state)),
        postItem: (item) => dispatch(postItem(item))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddItemPage);