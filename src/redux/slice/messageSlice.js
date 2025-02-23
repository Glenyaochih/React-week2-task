import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const messageSlice = createSlice({
  name: 'message',
  initialState: [],
  reducers: {
    createMessage(state, action) {
      if (action.payload.success) {
        state.push({
          id: action.payload.id,
          type: 'success',
          title: '新增成功',
          text: action.payload.message,
        });
      } else {
        state.push({
          id: action.payload.id,
          type: 'danger',
          title: '新增失敗',
          text: Array.isArray(action.payload?.message)
            ? action.payload?.message.join('、')
            : action.payload?.message,
        });
      }
    },


    removeMessage(state, action) {
      console.log('removeMessage:', action.payload);
      const index = state.findIndex((item) => item === action.payload);
      state.splice(index, 1);
    },
  },
});

export const createAsyncMessage = createAsyncThunk(
  'message/createAsyncMessage',
  async (payload, { dispatch, requestId }) => {
    dispatch(
      messageSlice.actions.createMessage({
        ...payload,
        id: requestId,
      })
    );

    setTimeout(() => {
      dispatch(messageSlice.actions.removeMessage(requestId));
    }, 5000);
  }
);

export const { createMessage } = messageSlice.actions;
export default messageSlice.reducer;
