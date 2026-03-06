<?php
/* --------------------------------------------------------------
   DeletedId.inc.php 2018-07-05
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class DeletedId
 */
class DeletedId
{
    /**
     * @var string
     */
    private $id;
    
    
    /**
     * DeletedId constructor.
     *
     * @param \NonEmptyStringType $id Deleted id.
     */
    public function __construct(NonEmptyStringType $id)
    {
        $this->id = $id->asString();
    }
    
    
    /**
     * Named constructor of deleted id.
     *
     * @param mixed $id Deleted id (must not be empty!).
     *
     * @return \DeletedId New instance.
     */
    public static function create($id)
    {
        return MainFactory::create(static::class, new NonEmptyStringType((string)$id));
    }
    
    
    /**
     * Returns the deleted id.
     *
     * @return string Deleted id.
     */
    public function id()
    {
        return $this->id;
    }
}