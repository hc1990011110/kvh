/**数据差异模式 */
export const enum DIFF_MODE {
  /**删除模式
   * 将会完整保存旧值，用于恢复数据
   */
  DELETE,
  /**新增模式 */
  INSERT,
  /**变更模式，
   * 需要依赖算法来算出旧值
   */
  UPDATE,
  /**备份模式
   * 和删除模式类似，会保存完整旧值
   */
  BACKUP,
}
