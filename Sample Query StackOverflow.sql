
SELECT p.Id,
       p.AcceptedAnswerId,
       p.AnswerCount,
       p.ClosedDate,
       p.CommentCount,
       p.CommunityOwnedDate,
       p.CreationDate,
       p.FavoriteCount,
       p.LastActivityDate,
       p.LastEditDate,
       p.LastEditorDisplayName,
       p.LastEditorUserId,
       p.OwnerUserId,
       p.ParentId,
       p.PostTypeId,
       ptype.Type,
       p.Score,
       p.Tags,
       p.title,
       p.ViewCount,
       pt.Tag
FROM   Posts p
JOIN   PostTags  pt    ON pt.PostId = p.Id
JOIN   PostTypes ptype ON p.PostTypeId = ptype.Id
JOIN   Users     u     ON p.OwnerUserId = u.Id
JOIN   Comments  c     ON p.Id = c.PostId
WHERE  p.CreationDate > '2013-01-01'

SELECT *
FROM   Posts p
JOIN   Users u on p.OwnerUserId = u.Id
JOIN   Votes v ON p.Id = v.PostId
WHERE  u.DisplayName = 'Jon Skeet'

