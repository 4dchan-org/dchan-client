import { useQuery } from '@apollo/react-hooks';
import Error from 'components/Error';
import Loading from 'components/Loading';
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
                thread,
                post
            } = data

            if (board?.name && board?.id && thread?.id) {
                location = `/${board?.name}/${board?.id}/${thread?.id}`
            }

            if (board?.name && board?.id) {
                location = `/${board?.name}/${board?.id}/${thread?.id}`
            }

            if (thread?.board?.name && thread?.board?.id && thread?.id) {
                location = `/${thread?.board?.name}/${thread?.board?.id}/${thread?.id}`
            }

            if (post?.thread?.board?.name && post?.thread?.board?.id && post?.thread?.id) {
                location = `/${post?.thread?.board?.name}/${post?.thread?.board?.id}/${post?.thread?.id}`
            }

            console.log({data, location})

            if (location) {
                history.replace(location)
            }
        }
    }, [history, data])


    return (
        <div className="bg-primary center grid w-screen h-screen">
            {loading ? <Loading></Loading> : !data ? <Error subject="Not found" body="This is a 404 page"></Error> : ""}
        </div>
    );
}