import React, { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function Password({ roomId }) {
  const [showRoomId, setShowRoomId] = useState(false);
  console.log(roomId);
  return (
    <div className="flex flex-row gap-10">
      <p className="text-red-300 sm:tracking-tight md:tracking-wider sm:text-xl md:text-2xl relative">
        Your Room Id : {!showRoomId ? '************************' : roomId}
      </p>
      <div>
        {showRoomId ? (
          <span onClick={() => setShowRoomId(false)}>
            <VisibilityIcon />
          </span>
        ) : (
          <span onClick={() => setShowRoomId(true)}>
            <VisibilityOffIcon />
          </span>
        )}
      </div>
    </div>
  );
}

export default Password;
