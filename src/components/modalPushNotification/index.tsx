import numbro from 'numbro';
import React from 'react';
import CustomModal from '../modal';
import InvitationModal from '../invitationModal/index'
import RejectedModal from '../rejectedModal';

const ModalPushNotification: React.FC<{
  data?: any,
  navigation: any,
  setOpenModal: any
}> = ({ data, navigation, setOpenModal }) => {
  const notifeeData = data.gameMatch ? JSON.parse(data.gameMatch || '') : {}
  return (
    <CustomModal>
      {notifeeData?.type === 'invitation' ? (
        <InvitationModal data={data} navigation={navigation} setOpenModal={setOpenModal} />
      ) : null}
      {notifeeData?.type === 'rejected' ? (
        <RejectedModal data={data} navigation={navigation} setOpenModal={setOpenModal} />
      ) : null}
    </CustomModal>
  );
};


export default ModalPushNotification; 