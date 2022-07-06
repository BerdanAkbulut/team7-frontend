import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import { useRouter } from 'next/router';
function Back() {
  const router = useRouter();
  const handleBack = () => {
    router.push('/');
 
  };
  return (
    <>
      <span>
        <ArrowBackTwoToneIcon
          className="transition-all ease-in-out duration-700 hover:scale-90 cursor-pointer"
          style={{ color: 'white' }}
          onClick={handleBack}
        />
      </span>
    </>
  );
}

export default Back;
