import { useQuery } from '@apollo/react-hooks';
import Error from 'components/Error';
import Loading from 'components/Loading';
import Spinner from 'components/Spinner';
import SEARCH_BY_ID from 'dchan/graphql/queries/search';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default function ReferencePage({ match: { params: { ref } } }: any) {
    const { loading, data } = useQuery<any, any>(
        SEARCH_BY_ID,
        { variables: { id: `0x${ref}` } }
    );

    const history = useHistory()

    useEffect(() => {
        if (data) {
            let location = null

            const {
                board,
                thread
            } = data

            if (board?.name && board?.id && thread?.id) {
                location = `/${board?.name}/${board?.id}/${thread?.id}`
            }

            if (board?.name && board?.id) {
                location = `/${board?.name}/${board?.id}/${thread?.id}`
            }

            if (location) {
                history.push(location)
            }
        }
    }, [data])


    return (
        <div className="center grid w-screen h-screen">
            {loading ? <div><Spinner></Spinner><Loading></Loading></div> : <Error subject="Not found" body="This is a 404 page"></Error>
}
        </div>
    );
}